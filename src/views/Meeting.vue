<template>
  <div class="meeting-container">
    <div class="meeting-header">
      <div class="back-and-title">
        <div v-if="isBookRoom" class="back-button-wrapper" @click="goBack">
          <button class="back-button">
            <font-awesome-icon :icon="['fas', 'angle-left']" />
          </button>
        </div>
        <div class="title-and-path">
          <div v-if="!isBookRoom" class="title-only">
            <h1 class="inline-title">Ruang Meeting</h1>
            <div class="meeting-path">
              <span class="active">Ruang Meeting</span>
            </div>
          </div>
          <div v-if="isBookRoom" class="title-path-container">
            <h1 class="inline-title">Ruang Meeting</h1>
            <div class="meeting-path">
              <router-link to="/meeting" style="text-decoration: none">
                <span :class="{ active: !isBookRoom }">Ruang Meeting</span>
              </router-link>
              <font-awesome-icon :icon="['fas', 'angle-right']" size="sm" />
              <span :class="{ active: isBookRoom }">Pesan Ruangan</span>
            </div>
          </div>
        </div>
      </div>
      <router-link v-if="!isBookRoom" class="pesan-button" to="/meeting/pesan-ruangan">
        <font-awesome-icon :icon="['fas', 'plus']" /> Pesan Ruangan
      </router-link>
    </div>
    <div v-if="isBookRoom" class="form-container">
      <form class="meeting-form">
        <h3>Informasi Ruang Meeting</h3>
        <div class="form-row">
          <div class="form-column">
            <div class="form-group">
              <label for="unit">Unit</label>
              <select id="unit" v-model="selectedOfficeId" required>
                <option value="" disabled>Pilih Unit</option>
                <option v-for="office in offices" :key="office.id" :value="office.id">
                  {{ office.officeName }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="ruangMeeting">Ruang Meeting</label>
              <select id="ruangMeeting" v-model="selectedRoomId" class="custom-select" :disabled="!selectedOfficeId"
                required>
                <option value="" disabled>Pilih Ruang Meeting</option>
                <option v-for="room in filteredRooms" :key="room.id" :value="room.id">
                  {{ room.roomName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="capicity">Kapasitas</label>
          <input type="number" id="capicity" v-model="selectedRoomCapacity" style="background-color: lightgray"
            readonly />
        </div>

        <hr class="form-divider" />

        <h3>Informasi Rapat</h3>
        <div class="form-row">
          <div class="form-column">
            <div class="form-group">
              <label for="meetingDate">Tanggal Rapat</label>
              <input type="date" id="meetingDate" v-model="meetingDate" />
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="startTime">Waktu Mulai</label>
              <input type="time" id="startTime" v-model="startTime" />
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="finishTime">Waktu Selesai</label>
              <input type="time" id="finishTime" v-model="finishTime" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="participantCount">Jumlah Peserta</label>
          <input min="1" max="100" id="participantCount" type="text" v-model="participantCount"
            onfocus="(this.type='number')" onblur="(this.type='text')" placeholder="Masukan Jumlah Peserta" />
        </div>
        <div class="form-group checkbox-group">
          <label>Konsumsi Rapat</label>
          <div class="checkbox-item">
            <input type="checkbox" v-model="autoChecked.snackSiang" disabled />
            <label for="snackSiang">Snack Siang</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" v-model="autoChecked.makanSiang" disabled />
            <label for="makanSiang">Makan Siang</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" v-model="autoChecked.snackSore" disabled />
            <label for="snackSore">Snack Sore</label>
          </div>
        </div>
        <div class="form-nominal">
          <label for="total-nominal">Nominal Konsumsi</label>
          <div class="group-nominal">
            <span class="currency-label">Rp.</span>
            <input id="total-nominal" :value="formatNominal(totalNominal)" class="input-field" readonly />
          </div>
        </div>

        <hr class="form-divider" />

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="goBack">
            Batal
          </button>
          <button type="submit" class="save-button" @click="handleSubmit">
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMeetingStore } from '../stores/meetingStore';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const meetingStore = useMeetingStore();

const isBookRoom = computed(() => route.params.view === 'pesan-ruangan');
const isLoading = ref(true);

const offices = ref([]);
const rooms = ref([]);
const selectedRoomName = ref('');
const selectedOfficeId = ref('');
const selectedRoomId = ref('');
const selectedRoomCapacity = ref(0);
const participantCount = ref(0);
const meetingDate = ref('');
const startTime = ref('');
const finishTime = ref('');
const autoChecked = ref({
  snackSiang: false,
  makanSiang: false,
  snackSore: false,
});
const totalNominal = ref(0);
const lastId = ref(0);

const filteredRooms = computed(() => {
  const officeId = selectedOfficeId.value;
  if (!officeId) {
    return [];
  }
  return rooms.value.filter(room => room.officeId === officeId);
});

const validateForm = () => {
  if (!selectedOfficeId.value) {
    Swal.fire({
      icon: 'error',
      title: 'Input Kosong',
      text: 'Silakan pilih Unit.',
    });
    return false;
  }
  if (!selectedRoomId.value) {
    Swal.fire({
      icon: 'error',
      title: 'Input Kosong',
      text: 'Silakan pilih Room.',
    });
    return false;
  }
  if (!meetingDate.value) {
    Swal.fire({
      icon: 'error',
      title: 'Input Kosong',
      text: 'Silakan pilih Tanggal Rapat.',
    });
    return false;
  }
  const today = new Date().toISOString().split('T')[0];
  if (meetingDate.value <= today) {
    Swal.fire({
      icon: 'error',
      title: 'Tanggal Tidak Valid',
      text: 'Tanggal rapat tidak boleh hari ini atau sebelumnya.',
    });
    return false;
  }

  if (!startTime.value) {
    Swal.fire({
      icon: 'error',
      title: 'Input Kosong',
      text: 'Silakan pilih Waktu mulai meeting.',
    });
    return false;
  }
  if (!finishTime.value) {
    Swal.fire({
      icon: 'error',
      title: 'Input Kosong',
      text: 'Silakan pilih waktu selesai.',
    });
    return false;
  }
  const start = new Date(`1970-01-01T${startTime.value}:00`);
  const end = new Date(`1970-01-01T${finishTime.value}:00`);
  if (end <= start) {
    Swal.fire({
      icon: 'error',
      title: 'Waktu Tidak Valid',
      text: 'Waktu selesai tidak mungkin mundur dari waktu mulai.',
    });
    return false;
  }

  if (!participantCount.value) {
    Swal.fire({
      icon: 'error',
      title: 'Input Kosong',
      text: 'Silakan masukkan jumlah peserta.',
    });
    return false;
  }
  if (participantCount.value > selectedRoomCapacity.value) {
    Swal.fire({
      icon: 'error',
      title: 'Jumlah Melebihi Kapasitas',
      text: 'Jumlah peserta tidak boleh lebih besar dari kapasitas ruangan.',
    });
    return false;
  }

  return true;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    const start = new Date(`1970-01-01T${startTime.value}:00`);
    const end = new Date(`1970-01-01T${finishTime.value}:00`);

    autoChecked.value.snackSiang = start.getHours() < 11;
    autoChecked.value.makanSiang = start.getHours() < 14 && end.getHours() >= 11;
    autoChecked.value.snackSore = end.getHours() >= 14;

    const {
      totalNominalValue,
      totalSnackSiang,
      totalMakanSiang,
      totalSnackSore,
    } = calculateNominal();

    totalNominal.value = totalNominalValue;

    let newId = lastId.value + 1;
    lastId.value = newId;

    const selectedRoom = rooms.value.find(
      (room) => room.id === selectedRoomId.value
    );
    selectedRoomName.value = selectedRoom ? selectedRoom.roomName : '';

    const data = {
      id: newId,
      officeId: selectedOfficeId.value,
      roomCapacity: selectedRoomCapacity.value,
      participantCount: participantCount.value,
      meetingDate: meetingDate.value,
      startTime: startTime.value,
      finishTime: finishTime.value,
      autoChecked: autoChecked.value,
      totalNominal: totalNominal.value,
      snackSiangCount: totalSnackSiang,
      makanSiangCount: totalMakanSiang,
      snackSoreCount: totalSnackSore,
      roomName: selectedRoomName.value,
    };

    meetingStore.saveMeetingData(data);

    Swal.fire({
      icon: 'success',
      title: 'Formulir Valid',
      text: 'Formulir berhasil disimpan.',
    });
  }
};

const formatNominal = (nominal) => {
  if (typeof nominal === 'number') {
    return nominal.toLocaleString('id-ID');
  }
  return nominal;
};

const calculateNominal = () => {
  let totalCostPerParticipant = 0;
  let totalSnackSiang = 0;
  let totalMakanSiang = 0;
  let totalSnackSore = 0;


  if (autoChecked.value.snackSiang) {
    const valSnackSiang = meetingStore.konsumsi.find(el => el.name == 'Snack Siang')
    totalCostPerParticipant += valSnackSiang.maxPrice;
    totalSnackSiang = participantCount.value;
  }
  if (autoChecked.value.makanSiang) {
    const valMakanSiang = meetingStore.konsumsi.find(el => el.name == 'Makan Siang')
    totalCostPerParticipant += valMakanSiang.maxPrice;
    totalMakanSiang = participantCount.value;
  }
  if (autoChecked.value.snackSore) {
    const valSnackSore = meetingStore.konsumsi.find(el => el.name == 'Snack Sore')
    totalCostPerParticipant += valSnackSore.maxPrice;
    totalSnackSore = participantCount.value;
  }

  const totalNominalValue = totalCostPerParticipant * participantCount.value;

  return {
    totalNominalValue,
    totalSnackSiang,
    totalMakanSiang,
    totalSnackSore,
  };
};

const goBack = () => {
  router.push('/meeting');
};

onMounted(async () => {
  try {
    await meetingStore.fetchAllData();

    offices.value = meetingStore.offices;
    rooms.value = meetingStore.rooms;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching data', error);
    isLoading.value = false;
  }
});

watch(selectedRoomId, (newId) => {
  const room = rooms.value.find((room) => room.id === newId);
  if (room) {
    selectedRoomCapacity.value = room.capacity;
    selectedRoomName.value = room.roomName;
  }
});
</script>

<style>
.meeting-container {
  padding: 0.25em;
}

.meeting-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.25em;
}

.back-and-title {
  display: flex;
  align-items: start;
}

.back-button-wrapper {
  display: flex;
  margin-right: 1.25em;
  background-color: #027887;
  border-radius: 0.625em;
  cursor: pointer;
  width: 2.75em;
  height: 2.5em;
}

.back-button {
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border: none;
  color: white;
  margin: 0 auto;
}

.title-and-path {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-only {
  display: flex;
  flex-direction: column;
}

.title-path-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.inline-title {
  margin: 0;
  color: rgb(50, 50, 50);
}

.meeting-path {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5em;
}

.meeting-path span {
  color: rgb(50, 50, 50);
}

.meeting-path .active {
  color: #027887;
}

.pesan-button {
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
  background-color: #027887;
  padding: 0.5em 0.75em;
  border-radius: 0.5em;
  margin-top: 0.25em;
  color: white;
  cursor: pointer;
}

.pesan-button .fa-plus {
  margin-right: 1em;
}

.form-container {
  margin-top: 1.25em;
}

.meeting-form {
  display: flex;
  flex-direction: column;
  border: 0.0625em solid lightgray;
  border-radius: 0.5em;
  padding: 1em 1.5em;
}

.meeting-form label {
  font-weight: bold;
}

.meeting-form h3 {
  margin-bottom: 1em;
}

.form-group {
  margin-bottom: 0.9375em;
}

.form-group label {
  margin-bottom: 0.5em;
  display: block;
}

.form-nominal label {
  margin-bottom: 0.5em;
  display: block;
}

.form-group input,
.form-group select {
  border: 0.0625em solid lightgray;
  box-sizing: border-box;
  border-radius: 0.625em;
  width: 18.75em;
  padding: 0.5em;
}

.form-group input[type="checkbox"] {
  width: 1.5em;
  height: 1.5em;
  accent-color: #027887;
  margin-right: 0.5em;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-item input[type="checkbox"] {
  width: 1.5em;
  height: 1.5em;
  accent-color: #027887;
  margin-right: 0.5em;
}

.checkbox-item label {
  font-weight: normal;
  margin: 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}

.form-row {
  display: flex;
  gap: 1em;
}

.group-nominal {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
}

.currency-label {
  background-color: #f0f0f0;
  border: 0.0625em solid #ccc;
  border-radius: 0.625em 0 0 0.625em;
  border-right: none;
  padding: 0.5em;
}

.input-field {
  border: 0.0625em solid #ccc;
  border-left: none;
  border-radius: 0 0.625em 0.625em 0;
  padding: 0.5em;
  width: 16.875em;
}

select {
  &:invalid {
    color: gray;
  }

  [disabled] {
    color: gray;
  }

  option {
    color: black;
  }
}

.form-divider {
  border: 0;
  border-top: 0.0625em solid lightgray;
  margin: 1.25em 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.625em;
}

.form-actions button {
  padding: 0.625em 1.25em;
  cursor: pointer;
  border-radius: 8px;
}

.form-actions .cancel-button {
  background-color: #f44336;
  color: white;
}

.form-actions .save-button {
  background-color: #027887;
  color: white;
}

.form-actions .cancel-button:hover {
  background-color: #d32f2f;
}

.form-actions .save-button:hover {
  background-color: #025f6d;
}

.swal2-confirm {
  background-color: #009fb5 !important;
  color: white !important;
  border-radius: 0.625em;
  width: 9.375em;
}

.swal2-cancel {
  background-color: red !important;
  color: white !important;
  border-radius: 0.625em;
}

.swal2-content {
  color: #333;
}
</style>
