import { defineStore } from "pinia";
import axios from "axios";

export const useMeetingStore = defineStore("meetingStore", {
  state: () => ({
    meetings: [
      {
        "id": "100",
        "officeId": "1",
        "roomName": "Apollo Room",
        "roomCapacity": 50,
        "participantCount": 40,
        "meetingDate": "2024-08-01",
        "startTime": "09:00",
        "finishTime": "13:00",
        "autoChecked": { "snackSiang": true, "makanSiang": true, "snackSore": false },
        "totalNominal": 1200000,
        "snackSiangCount": 40,
        "makanSiangCount": 40,
        "snackSoreCount": 0
      },
      {
        "id": "101",
        "officeId": "2",
        "roomName": "Zenith Hall",
        "roomCapacity": 30,
        "participantCount": 20,
        "meetingDate": "2024-08-02",
        "startTime": "11:15",
        "finishTime": "15:00",
        "autoChecked": { "snackSiang": false, "makanSiang": true, "snackSore": true },
        "totalNominal": 800000,
        "snackSiangCount": 0,
        "makanSiangCount": 20,
        "snackSoreCount": 20
      },
      {
        "id": "102",
        "officeId": "3",
        "roomName": "Nebula Suite",
        "roomCapacity": 40,
        "participantCount": 35,
        "meetingDate": "2024-08-03",
        "startTime": "10:00",
        "finishTime": "13:00",
        "autoChecked": { "snackSiang": true, "makanSiang": true, "snackSore": false },
        "totalNominal": 1050000,
        "snackSiangCount": 35,
        "makanSiangCount": 35,
        "snackSoreCount": 0
      },
      {
        "id": "103",
        "officeId": "4",
        "roomName": "Celestial Lounge",
        "roomCapacity": 20,
        "participantCount": 15,
        "meetingDate": "2024-08-04",
        "startTime": "13:45",
        "finishTime": "16:00",
        "autoChecked": { "snackSiang": false, "makanSiang": true, "snackSore": true },
        "totalNominal": 450000,
        "snackSiangCount": 0,
        "makanSiangCount": 15,
        "snackSoreCount": 15
      },
      {
        "id": "104",
        "officeId": "5",
        "roomName": "Nova Space",
        "roomCapacity": 60,
        "participantCount": 50,
        "meetingDate": "2024-08-05",
        "startTime": "11:00",
        "finishTime": "13:00",
        "autoChecked": { "snackSiang": false, "makanSiang": true, "snackSore": false },
        "totalNominal": 1000000,
        "snackSiangCount": 0,
        "makanSiangCount": 50,
        "snackSoreCount": 0
      },
      {
        "id": "105",
        "officeId": "3",
        "roomName": "Eclipse Room",
        "roomCapacity": 25,
        "participantCount": 20,
        "meetingDate": "2024-08-06",
        "startTime": "13:50",
        "finishTime": "17:00",
        "autoChecked": { "snackSiang": false, "makanSiang": true, "snackSore": true },
        "totalNominal": 600000,
        "snackSiangCount": 0,
        "makanSiangCount": 20,
        "snackSoreCount": 20
      },
      {
        "id": "106",
        "officeId": "1",
        "roomName": "Lunar Center",
        "roomCapacity": 65,
        "participantCount": 53,
        "meetingDate": "2024-08-06",
        "startTime": "13:00",
        "finishTime": "15:00",
        "autoChecked": { "snackSiang": false, "makanSiang": true, "snackSore": true },
        "totalNominal": 800000,
        "snackSiangCount": 0,
        "makanSiangCount": 53,
        "snackSoreCount": 0
      },
      {
        "id": "107",
        "officeId": "4",
        "roomName": "Galaxy Lounge",
        "roomCapacity": 125,
        "participantCount": 89,
        "meetingDate": "2024-08-06",
        "startTime": "10:00",
        "finishTime": "14:00",
        "autoChecked": { "snackSiang": true, "makanSiang": true, "snackSore": true },
        "totalNominal": 1300000,
        "snackSiangCount": 89,
        "makanSiangCount": 89,
        "snackSoreCount": 89
      }
    ],
    offices: [],
    rooms: [],
    konsumsi: []
  }),

  actions: {
    async fetchOffices() {
      try {
        const response = await axios.get("https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice");
        this.offices = response.data;
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    },

    async fetchRooms() {
      try {
        const response = await axios.get("https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms");
        this.rooms = response.data;
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    },

    async fetchKonsumsi() {
      try {
        const response = await axios.get("https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi");
        this.konsumsi = response.data;
      } catch (error) {
        console.error("Error fetching konsumsi:", error);
      }
    },

    async fetchAllData() {
      try {
        await Promise.all([
          this.fetchOffices(),
          this.fetchRooms(),
          this.fetchKonsumsi()
        ]);
      } catch (error) {
        console.error("Error fetching all data:", error);
      }
    },

    async saveMeetingData(data) {
      try {
        this.meetings.push(data);
      } catch (error) {
        console.error("Error saving meeting data:", error);
      }
    },
  },

  getters: {
    totalParticipants: (state) => state.meetings.reduce((sum, meeting) => sum + meeting.participantCount, 0),
  },
});
