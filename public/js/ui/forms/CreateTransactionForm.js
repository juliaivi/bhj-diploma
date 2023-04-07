

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let accountsSelect = this.element.querySelector('.accounts-select');

    Account.list([], (err, response) => {
      if (err == null && response.success) {
        let options = '';
        response.data.forEach(el => { 
          options += `<option value="${el.id}">${el.name}</option>`;
        });

        accountsSelect.innerHTML = options;
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err == null && response.success) {
        App.getModal(this.element.closest('.modal').dataset.modalId).close();
        this.element.reset();
        App.update();
      }
    }); 
  }
}