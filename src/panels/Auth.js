import { Component } from 'react';

import { Button, FormItem, FormLayout, Input, Placeholder } from '@vkontakte/vkui';

import { lang } from '../js/lang';

import { AppContext } from '../js/AppContext';

const STATE_NUMBER = 'number';
const STATE_CODE = 'code';
const STATE_PASSWORD = 'password';

export class Auth extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            authState: STATE_NUMBER,
            buttonLoading: false,

            numberError: null,
            codeError: null,
            passwordError: null,
        };
    }

    componentDidMount = () => {
        console.log('this.context', this.context);
    }

    isLoading = (state) => {
        this.setState({ buttonLoading: state });
    };

    confirmNumber = async () => {
        const { number } = this.state;

        this.setState({ numberError: null });

        this.isLoading(true);
        const { phone_code_hash, error_message } = await this.context.MTProto.call('auth.sendCode', {
            phone_number: number,
            settings: {
                _: 'codeSettings',
            },
        });
        this.isLoading(false);

        if (error_message) {
            if (error_message === 'AUTH_RESTART') {
                this.confirmNumber();
            } else {
                this.setState({ numberError: this.context.MTProto.getError(error_message) });
            }
        } else {
            this.setState({
                phone_code_hash,
                authState: STATE_CODE,
            });
        }
    };

    confirmCode = async () => {
        const { code, number, phone_code_hash } = this.state;

        this.setState({ codeError: null });

        this.isLoading(true);
        const { _, error_message } = await this.context.MTProto.call('auth.signIn', {
            phone_code: code,
            phone_number: number,
            phone_code_hash: phone_code_hash,
        });
        this.isLoading(false);

        if (error_message) {
            if (error_message === 'SESSION_PASSWORD_NEEDED') {
                this.setState({
                    authState: STATE_PASSWORD,
                });
            } else {
                this.setState({
                    codeError: this.context.MTProto.getError(error_message)
                });
            }
        } else {
            if (_ === 'auth.authorizationSignUpRequired') {
                this.setState({
                    authState: STATE_NUMBER,
                    codeError: null,
                    numberError: lang('auth.not_registered'),
                });
            } else if (_ === 'auth.authorization') {
                this.context.openContent('loading');
                this.context.checkUser();
            }
        }
    };

    confirmPassword = async () => {
        const { password } = this.state;

        this.setState({ passwordError: null });

        this.isLoading(true);
        const { srp_id, current_algo, srp_B } = await this.context.MTProto.call('account.getPassword');
        const { g, p, salt1, salt2 } = current_algo;

        const { A, M1 } = await this.context.MTProto.instance.crypto.getSRPParams({
            g,
            p,
            salt1,
            salt2,
            gB: srp_B,
            password,
        });

        const { error_message } = await this.context.MTProto.call('auth.checkPassword', {
            password: {
                _: 'inputCheckPasswordSRP',
                srp_id,
                A,
                M1,
            },
        });

        this.isLoading(false);

        if (error_message) {
            this.setState({
                passwordError: this.context.MTProto.getError(error_message),
            });
        } else {
            this.context.openContent('loading');
            this.context.checkUser();
        }
    };

    InputItemRow = ({
                        visibleStates = [],
                        disabledStates = [],
                        error,
                        defaultValue,
                        setValue,
                        type,
                        header,
                    }) => {
        const { authState } = this.state;

        if (!visibleStates.includes(authState)) {
            return null;
        }

        return (
            <FormItem
                top={ header }
                status={ error ? 'error' : null }
                bottom={ error }
            >
                <Input
                    type={ type || 'text' }
                    defaultValue={ defaultValue }
                    disabled={ disabledStates.includes(authState) }
                    onChange={ (e) => setValue(e.target.value) }
                />
            </FormItem>
        );
    };

    ButtonItemRow = ({
                         visibleStates = [],
                         disabledValue = '',
                         onClick,
                         name
                     }) => {
        const { authState, buttonLoading } = this.state;

        if (!visibleStates.includes(authState)) {
            return null;
        }

        return (
            <FormItem key="confirm_code">
                <Button
                    size="l"
                    stretched
                    onClick={ onClick }
                    disabled={ (disabledValue || '').length === 0 || buttonLoading }
                    loading={ buttonLoading }
                >{ name }</Button>
            </FormItem>
        );
    };

    render() {
        const { numberError, codeError, passwordError, number, code, password } = this.state;

        const setInputState = (key) => {
            return (value) => {
                this.setState({ [key]: value })
            };
        };

        return (
            <FormLayout>
                <Placeholder>
                    { lang('auth.description')}
                </Placeholder>

                { this.InputItemRow({
                    header: lang('auth.input_number'),
                    visibleStates: [STATE_NUMBER, STATE_CODE, STATE_PASSWORD],
                    disabledStates: [STATE_CODE, STATE_PASSWORD],
                    error: numberError,
                    setValue: setInputState('number'),
                }) }

                { this.InputItemRow({
                    header: lang('auth.input_code'),
                    visibleStates: [STATE_CODE, STATE_PASSWORD],
                    disabledStates: [STATE_PASSWORD],
                    error: codeError,
                    setValue: setInputState('code'),
                }) }

                { this.InputItemRow({
                    header: lang('auth.input_password'),
                    visibleStates: [STATE_PASSWORD],
                    disabledStates: [],
                    type: 'password',
                    error: passwordError,
                    setValue: setInputState('password'),
                }) }

                { this.ButtonItemRow({
                    visibleStates: [STATE_NUMBER],
                    disabledValue: number,
                    onClick: this.confirmNumber,
                    name: lang('auth.button_number'),
                }) }

                { this.ButtonItemRow({
                    visibleStates: [STATE_CODE],
                    disabledValue: code,
                    onClick: this.confirmCode,
                    name: lang('auth.button_code'),
                }) }

                { this.ButtonItemRow({
                    visibleStates: [STATE_PASSWORD],
                    disabledValue: password,
                    onClick: this.confirmPassword,
                    name: lang('auth.button_password'),
                }) }
            </FormLayout>
        );
    }

}
