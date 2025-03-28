/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    sidebarToggle.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    });
  }
  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    let register = document.querySelector('.menu-item_register');
    let login = document.querySelector('.menu-item_login');
    let logout = document.querySelector('.menu-item_logout');

    register.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('register').open();
    })

    login.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('login').open();
    })

    logout.addEventListener('click', (event) => {
      event.preventDefault();
      User.logout((err, response) => {
        if (err !== null) {
          console.error(err);
        }
        
        if (err == null && response.success) {
          App.setState('init');
        } 
      });
    })
  }
}