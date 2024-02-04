/**
 * Pobieranie elementów HTML
 * @type {HTMLElement}
 */
const alarmsList = document.getElementById('alarms-list');

  
/**
 * Funkcja wyświetlająca listę alarmów
 */
function displayAlarms() {
  alarmsList.innerHTML = ''; // Wyczyszczenie listy

  // Pobieranie listy alarmów z localStorage
  let alarms = JSON.parse(localStorage.getItem('alarms')) || [];

  alarms.forEach((alarm, index) => {
      const alarmItem = document.createElement('div');
      alarmItem.innerHTML = `
          <p>Godzina: ${alarm[0]}, Data: ${alarm[1]}, 
          Powtarzaj: ${alarm[2]}</p>`;
      alarmsList.appendChild(alarmItem);
  });
}

// Wywołanie funkcji displayAlarms() przy ładowaniu strony
  displayAlarms();
  