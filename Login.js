import React, {Component} from 'react';
import {View, Text, Image, Platform} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Spinner,
  CheckBox,
} from 'native-base';
import styles from '../../Styles/login.styles';
import PrimaryButton from '../../Components/PrimaryButton';
import CircleBackground from '../../Components/Circle/OrangeCircle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ApplicationStyles from '../../Theme/ApplicationStyles';
import {checkEmail} from '../../Helpers/Validators';
import ACTIONS from '../../Constants/ACTIONS';
import withAuthContext from '../../HOC/withAuthContext';
import withErrorContext from '../../HOC/withErrorContext';
import ErrorComponent from '../../Components/ErrorComponent';
import COLORS from '../../Theme/Colors';
import {Colors} from '../../Theme';
import Analytics from 'appcenter-analytics';
class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {email: '', password: '', rememberMe: false},
    };
  }
  handleLoginBtn = () => {
    Analytics.trackEvent(
      'login btn pressed with formData',
      this.state.formData,
    );
    if (!checkEmail(this.state.formData.email)) {
      this.props.setError(
        'email',
        'email',
        'Please enter a valid email address',
      );
    }
    if (this.state.formData.password.trim() === '') {
      this.props.setError('password', 'password', 'Password is required!');
    }
    if (Object.keys(this.props.errors).length === 0) {
      // no validation errors
      this.props.login(this.state.formData, this.props.setError);
    }
  };

  handleCheckbox = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        rememberMe: !this.state.formData.rememberMe,
      },
    });
  };
  handleInput = (key, value) => {
    if (this.props.errors[key]) {
      this.props.clearError(key);
    }
    if (this.props.errors.loginError) {
      this.props.clearError('loginError');
    }
    this.setState({formData: {...this.state.formData, [key]: value}});
  };

  render() {
    return (
      <Container>
        <CircleBackground />
        <Image
          source={require('../../../assets/icons/App_Logo_Sm.png')}
          style={styles.stickyLogoContainer}
        />
        <Content bounces={false} style={styles.container}>
          <Form style={styles.form}>
            <Item floatingLabel style={styles.Item}>
              <Label style={ApplicationStyles.inputLabel}>EMAIL ADDRESS</Label>
              <Input
                style={ApplicationStyles.input}
                keyboardType="email-address"
                onChangeText={email => this.handleInput('email', email)}
              />
            </Item>
            {this.props.errors.email && (
              <ErrorComponent error={this.props.errors.email.error} />
            )}
            <Item floatingLabel style={styles.Item}>
              <Label style={ApplicationStyles.inputLabel}>PASSWORD</Label>
              <Input
                secureTextEntry={true}
                style={ApplicationStyles.input}
                onChangeText={password =>
                  this.handleInput('password', password)
                }
              />
            </Item>
            {this.props.errors.password && (
              <ErrorComponent error={this.props.errors.password.error} />
            )}
            <View style={styles.checkboxView}>
              <CheckBox
                onPress={this.handleCheckbox}
                color={Colors.secondary}
                checked={this.state.formData.rememberMe}
                style={styles.checkboxStyle}
              />
              <Text style={styles.CText}>Remember Me</Text>
            </View>

            <View style={styles.forgotView}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ForgotPassword')}
                style={styles.forgotBtn}>
                <Text style={styles.forgotLabel}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
          </Form>
          {this.props.errors.loginError && (
            <ErrorComponent error={this.props.errors.loginError.error} />
          )}
          <PrimaryButton
            label="SIGN IN"
            margin={15}
            loading={this.props.loading === 'login'}
            mt={70}
            disabled={
              this.props.loading === 'login' ||
              Object.keys(this.props.errors).length > 0
            }
            onPress={() => this.handleLoginBtn()}
          />

          <View style={styles.bottomRow}>
            <Text style={styles.newUser}>New to PopUp?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Signup')}
              style={styles.signupTouchable}>
              <Text style={styles.signupLabel}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

export default withErrorContext(withAuthContext(LoginScreen));
