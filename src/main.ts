import './style.css'
import { SecretSantaManager } from './logic'

const manager = new SecretSantaManager();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>Secret Santa</h1>
    
    <div class="group-section">
      <h2>Utwórz grupę</h2>
      <input type="text" id="groupName" placeholder="Nazwa grupy">
      <button id="createGroup">Utwórz grupę</button>
    </div>

    <div class="participant-section">
      <h2>Dodaj uczestnika</h2>
      <input type="text" id="participantName" placeholder="Imię uczestnika">
      <button id="addParticipant">Dodaj uczestnika</button>
    </div>

    <div class="draw-section">
      <button id="drawButton">Przeprowadź losowanie</button>
    </div>

    <div class="results-section">
      <h2>Wyniki losowania</h2>
      <div id="results"></div>
    </div>
  </div>
`

let currentGroup = '';

// Obsługa tworzenia grupy
document.querySelector('#createGroup')?.addEventListener('click', () => {
  const groupNameInput = document.querySelector<HTMLInputElement>('#groupName');
  const groupName = groupNameInput?.value;
  
  if (groupName) {
    try {
      manager.createGroup(groupName);
      currentGroup = groupName;
      alert(`Utworzono grupę: ${groupName}`);
      groupNameInput!.value = '';
    } catch (error) {
      alert(error);
    }
  }
});

// Obsługa dodawania uczestnika
document.querySelector('#addParticipant')?.addEventListener('click', () => {
  if (!currentGroup) {
    alert('Najpierw utwórz grupę!');
    return;
  }

  const participantNameInput = document.querySelector<HTMLInputElement>('#participantName');
  const participantName = participantNameInput?.value;
  
  if (participantName) {
    try {
      manager.addParticipantToGroup(currentGroup, participantName);
      alert(`Dodano uczestnika: ${participantName}`);
      participantNameInput!.value = '';
    } catch (error) {
      alert(error);
    }
  }
});

// Obsługa losowania
document.querySelector('#drawButton')?.addEventListener('click', () => {
  if (!currentGroup) {
    alert('Najpierw utwórz grupę!');
    return;
  }

  try {
    manager.drawForGroup(currentGroup);
    const assignments = manager.getGroupAssignments(currentGroup);
    
    const resultsDiv = document.querySelector('#results');
    if (resultsDiv) {
      resultsDiv.innerHTML = assignments
        .map(assignment => `
          <div class="assignment">
            ${assignment.giver.name} kupuje prezent dla ${assignment.receiver.name}
          </div>
        `)
        .join('');
    }
  } catch (error) {
    alert(error);
  }
});
