/**
 * Pobieranie elementów HTML
 * @type {HTMLElement}
 */
const modal = document.getElementById('myModal');
const closeModal = document.getElementsByClassName('close')[0];
const alarmsList = document.getElementById('alarms-list');

/**
 * Funkcja aktualizująca obecną godzinę
 */
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const currentTime = '<h1>'+hours + ':' + minutes + ':' + seconds+'</h1>';

    const myClock = document.getElementById('clock');

    myClock.innerHTML = currentTime;
    
}

setInterval(updateTime, 100); // Aktualizacja czasu

/**
 * Funkcja pobierająca alarmy z localStorage
 * @returns {Promise} - Obietnica zawierająca listę alarmów
 */
// W tej implementacji funkcje getAlarms() i removeAlarm() zwracają obietnice, 
// które rozwiązują się odpowiednio, gdy dane są pomyślnie pobrane lub alarm
// zostaje pomyślnie usunięty. Jeśli wystąpi błąd, obietnice zostaną odrzucone,
// a błąd będzie dostępny w bloku catch dla obsługi błędów.
// Funkcja pobierająca alarmy z localStorage
function getAlarms() {
  return new Promise((resolve, reject) => {
    const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    if (alarms) {
      resolve(alarms);
    } else {
      reject('Nie można pobrać alarmów');
    }
  });
}

/**
 * Funkcja usuwająca alarm z localStorage
 * @param {number} index - Indeks alarmu do usunięcia
 * @returns {Promise} - Obietnica potwierdzająca usunięcie alarmu
 */
function removeAlarm(index) {
  return new Promise((resolve, reject) => {
    let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.splice(index, 1); // Usunięcie alarmu o danym indeksie
    localStorage.setItem('alarms', JSON.stringify(alarms));
    resolve('Alarm usunięty');

    displayAlarms();
  });
}

/**
 * Funkcja ustawiająca nowy alarm
 */
function setAlarm() {
  const alarmTime = document.getElementById('alarm-time').value;
  const alarmDate = document.getElementById('alarm-date').value;
  const repeat = document.getElementById('alarm-repeat').value;


  const now = new Date();
  const alarmDateTime = new Date(alarmDate + 'T' + alarmTime);
  
  // Sprawdzenie, czy data alarmu już minęła
  if (alarmDateTime > now) {
      const timeDiff = alarmDateTime - now;
      setTimeout(() => {
        // Sprawdzenie, czy alarm jest nadal aktywny
        let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        let currentAlarm = alarms.find(alarm => alarm[0] === alarmTime && alarm[1] === alarmDate);
        if (currentAlarm && currentAlarm[3]) {
          showModal();
        }
      }, timeDiff);
    

    // Dodawanie alarmu do listy
    const newAlarm = [
      alarmTime,
      alarmDate,
      repeat,
      true
    ];

    // Pobieranie listy alarmów z localStorage
    let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.push(newAlarm);
    localStorage.setItem('alarms', JSON.stringify(alarms));

    // Aktualizacja listy alarmów na stronie głównej
    displayAlarms();
  } else {
    alert('Nie możesz wybrać daty z przeszłości');
  }
}

/**
 * Funkcja wyświetlająca listę alarmów
 */
function displayAlarms() {
  getAlarms()
    .then(alarms => {
      alarmsList.innerHTML = ''; // Wyczyszczenie listy
      
      alarms.forEach((alarm, index) => {
        const alarmItem = document.createElement('div');
        alarmItem.innerHTML = `
          <p>Godzina: ${alarm[0]}, Data: ${alarm[1]}, Powtarzaj: ${alarm[2]}</p>
          <button onclick="toggleAlarm(${index})">${alarm[3] ? 'Dezaktywuj' : 'Aktywuj'}</button>
          <button onclick="removeAlarm(${index})">Usuń</button>`;
        alarmItem.dataset.index = index; // Dodanie indeksu alarmu jako atrybutu data-index

        alarmsList.appendChild(alarmItem);
      });
    })
    .catch(error => {
      console.error('Błąd podczas pobierania alarmów', error);
    });
}

/**
 * Funkcja przełączająca stan alarmu (aktywny/nieaktywny)
 * @param {number} index - Indeks alarmu do przełączenia
 */
function toggleAlarm(index) {
  getAlarms()
    .then(alarms => {
      alarms[index][3] = !alarms[index][3]; // Zmiana wartości trzeciego elementu tablicy (active)
      localStorage.setItem('alarms', JSON.stringify(alarms));
      displayAlarms();
    })
    .catch(error => {
      console.error('Błąd podczas przełączania alarmu:', error);
    });
}

/**
 * Funkcja pokazująca modal
 */
function showModal() {
  modal.style.display = 'block';
}

// Zamykanie modalu po kliknięciu przycisku "x"
closeModal.onclick = function() {
  modal.style.display = 'none';
}

// Zamykanie modalu po kliknięciu na obszarze poza okem
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Wywołanie funkcji displayAlarms() przy ładowaniu strony
displayAlarms();
