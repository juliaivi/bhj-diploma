/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if(!element) {
      throw new Error("Переданный элемент не существует!!");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    let contentWrapper = document.querySelector('.content-wrapper');
    contentWrapper.addEventListener('click', (event) => {
      if (event.target.classList.contains('remove-account')) {
        this.removeAccount(event.target);
      }

      if (event.target.classList.contains('transaction__remove')) {
        event.preventDefault();
        this.removeTransaction(event.target.dataset.id);
      }
    })
//стары й код, переписала на более короткую версию....
    // const removeAccount = document.querySelector('.remove-account');
    // const transactionRemove = document.querySelector('.transaction__remove');

    // removeAccount.addEventListener('click', (event) => {
    //   this.removeAccount(event.target);
    // })

    // if (transactionRemove == null) {
    //   return false;
    // }

    // transactionRemove.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   this.removeTransaction(event.target.dataset.id);
    // })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const id = this.lastOptions.account_id;
      if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove({id}, (err, response) => {
          if (err == null && response.success) {
            this.clear();
            App.updateWidgets();
            App.updateForms();
          }
        })
      } 
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, (err, response) => {
        if (err == null && response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.lastOptions = options;
    if (options) {
      Account.get(options.account_id, (err, response) => {
        if (err == null && response.success) {
          this.renderTitle(response.data.name);
        }  
      });

      Transaction.list([], (err, response) => {
        if (err == null && response.success) {
           this.renderTransactions(response.data);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const data = new Date(date);

    let month = data.toLocaleString('ru', {
      month: 'long',
    });
  
    let hours = data.getHours();
    let hoursCount = hours > 9 ? hours : `0${hours}`;
    let minute = data.getMinutes();
    let minuteCount = minute > 9 ? minute : `0${minute}`;

    return `${data.getDay}${month}${data.getFullYear} г. в ${hoursCount}:${minuteCount}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${item.type.toLowerCase() == 'icone' ? 'icone' : 'expanse'} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
              </div>
            </div>
            <div class="col-md-3">
            <div class="transaction__summ">
              ${item.sum}<span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
          </button>
          </div>
        </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let content = this.element.querySelector('.content');
    content.innerHTML = '';
    if (data.length > 0) {
      data.forEach((el) => {
        content.insertAdjacentHTML('beforeend', this.getTransactionHTML(el));
      });
    }
  }
}

