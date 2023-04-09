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
    if (data == "" || data == null || data == undefined) {
      console.error('Ошибка в onSubmit(data). Не прошла регистрация');
      return;
    }
    User.register(data, (err, response) => {
      if (err !== null) {
        console.error(err);
      }
      
      if (response.success) {
        this.element.reset();
        App.setState('user-logged');
        App.getModal('register').close();
      }
    });
  }
}