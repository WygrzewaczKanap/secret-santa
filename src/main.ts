import './style.css'
import { SecretSantaManager } from './logic'

const manager = new SecretSantaManager();
let currentGroup = '';

function updateGroupsList() {
  const groupsList = document.querySelector('#groupsList');
  if (!groupsList) return;

  const groups = manager.getGroups();
  
  groupsList.innerHTML = groups.map(group => `
    <div class="group-item">
      <h3 class="group-name ${group.name === currentGroup ? 'selected' : ''}" data-group="${group.name}">
        ${group.name}
      </h3>
      <ul class="participants-list">
        ${group.participants.map(participant => `
          <li>${participant.name}</li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  document.querySelectorAll('.group-name').forEach(groupElement => {
    groupElement.addEventListener('click', (e) => {
      const groupName = (e.target as HTMLElement).dataset.group;
      if (groupName) {
        selectGroup(groupName);
      }
    });
  });
}

function selectGroup(groupName: string) {
  currentGroup = groupName;
  document.querySelector('#currentGroupName')!.textContent = groupName;
  updateGroupsList();
}

document.querySelector('#createGroup')?.addEventListener('click', () => {
  const groupNameInput = document.querySelector<HTMLInputElement>('#groupName');
  const groupName = groupNameInput?.value;
  
  if (groupName) {
    try {
      manager.createGroup(groupName);
      currentGroup = groupName;
      groupNameInput!.value = '';
      updateGroupsList();
      selectGroup(groupName);
    } catch (error) {
      alert(error);
    }
  }
});

document.querySelector('#addParticipant')?.addEventListener('click', () => {
  if (!currentGroup) {
    alert('Najpierw wybierz grupę!');
    return;
  }

  const participantNameInput = document.querySelector<HTMLInputElement>('#participantName');
  const participantName = participantNameInput?.value;
  
  if (participantName) {
    try {
      manager.addParticipantToGroup(currentGroup, participantName);
      participantNameInput!.value = '';
      updateGroupsList();
    } catch (error) {
      alert(error);
    }
  }
});

document.querySelector('#drawButton')?.addEventListener('click', () => {
  if (!currentGroup) {
    alert('Najpierw wybierz grupę!');
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

updateGroupsList();
