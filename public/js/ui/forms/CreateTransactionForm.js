

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
    let accountsSelect = document.querySelectorAll('.accounts-select');

    Account.list([], (err, response) => {
      if (err) {
        return false;
      }

      if (!response.success) {
        return false;
      }
      accountsSelect.forEach((item) => {
        let option;
        response.data.forEach(el => { 
          option = `<option value="${el.id}">${el.name}</option>`;
          item.insertAdjacentHTML("beforeend", option);
        });
      })
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (!response.success) {
        return false;
      }

      let modal = document.querySelectorAll(".modal");
      modal.forEach((el) => {
        if (el.dataset.modalId === "newExpense") {
          App.getModal("newExpense").close();
        }
        if (el.dataset.modalId === "newIncome") {
          App.getModal("newIncome").close();
        }
      })

      this.element.reset();
      App.update();
    })

  }
}