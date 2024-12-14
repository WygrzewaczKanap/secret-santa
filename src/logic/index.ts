// Participant
interface Participant {
    name: string;
  }
  
  interface Assignment {
    giver: Participant;
    receiver: Participant;
  }
  
  // Manager
  export class SecretSantaManager {
    private groups: Map<string, Participant[]> = new Map();
    private assignments: Map<string, Assignment[]> = new Map();
  
    createGroup(name: string): void {
      if (this.groups.has(name)) {
        throw new Error('Grupa już istnieje');
      }
      this.groups.set(name, []);
    }
  
    addParticipantToGroup(groupName: string, participantName: string): void {
      const group = this.groups.get(groupName);
      if (!group) {
        throw new Error('Grupa nie istnieje');
      }
      group.push({ name: participantName });
    }
  
    drawForGroup(groupName: string): void {
      const group = this.groups.get(groupName);
      if (!group || group.length < 2) {
        throw new Error('Za mało uczestników do losowania');
      }
  
      const shuffled = [...group].sort(() => Math.random() - 0.5);
      const assignments: Assignment[] = [];
  
      for (let i = 0; i < shuffled.length; i++) {
        assignments.push({
          giver: shuffled[i],
          receiver: shuffled[(i + 1) % shuffled.length]
        });
      }
  
      this.assignments.set(groupName, assignments);
    }
  
    getGroupAssignments(groupName: string): Assignment[] {
      return this.assignments.get(groupName) || [];
    }
  
    getGroups(): { name: string, participants: Participant[] }[] {
      return Array.from(this.groups.entries()).map(([name, participants]) => ({
        name,
        participants: [...participants]
      }));
    }
  }