/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

//const { response } = require("express");

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Переданный элемент не существует!!");
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = this.element.querySelector(".create-account");
    console.log(createAccount);
    createAccount.addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal("createAccount").open();
    })

    let accountsPanel = document.querySelector('.accounts-panel');
    accountsPanel.addEventListener('click', (event) => {
      let currentЕlement = event.target;
      let account = currentЕlement.closest(".account")
      event.preventDefault();
      this.onSelectAccount(account);
    })
    }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  
  update() {
    let userCurrent = User.current();
    if (userCurrent) {
    
      Account.list([], (err, response) => {
        if (err) {
          return err;
        }

        if (response == "" || response == null || response == undefined) {
          return false;
        }

        
          this.clear();
          if (response.data) {
            response.data.forEach((el) => {
              this.renderItem(el);
            }); 
          } 
        
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let accounts = Array.from(this.element.querySelectorAll('.account'));
    for (const account of accounts) {
      account.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    let idebarMenu = document.querySelector('.accounts-panel');
    idebarMenu.querySelectorAll('.account').forEach((el) => {
      el.classList.remove('active');
    })

    if (!element) {
      return;
    }

    element.classList.add('active');
    App.showPage( 'transactions', {
      account_id: element.dataset.id
    });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return ` <li class="account" data-id="${item.id}">
              <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum}₽</span>
              </a>
            </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(data));
  }
}
