/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    console.log (data);
    User.register(data, (err, response) => {
      if (response == "" || response == null || response == undefined) {
        return false;
      }

      if (err) {
        throw new Error(err);
      }

      if (response && response.success) {//cразу авторизуем пользователя после успешной регистрации
        this.element.reset()
        App.setState( 'user-logged' )
        App.getModal('register').close();
      }
    })

  }
}