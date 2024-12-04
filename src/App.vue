<template>
  <div class="app">
    <div class="navbar">
      <div class="content-container">
        <router-link to="/" class="content-left">
          <img :src="logo" alt="Logo" class="logo" />
          <p class="logo-text">iMeeting</p>
        </router-link>
        <div class="content-right">
          <font-awesome-icon :icon="['far', 'bell']" class="navbar-icon" />
          <div class="profile">
            <img :src="profile" alt="Profile" class="profile-pict" />
            <span class="profile-name">John Doe</span>
          </div>
          <font-awesome-icon
            :icon="['fas', 'angle-down']"
            class="navbar-icon angle-down-icon"
          />
        </div>
      </div>
    </div>

    <div class="body-container">
      <div class="sidebar">
        <router-link to="/dashboard" class="sidebar-item">
          <font-awesome-icon :icon="['fas', 'home']" class="sidebar-icon" />
        </router-link>
        <router-link to="/meeting" class="sidebar-item">
          <font-awesome-icon :icon="['fas', 'file']" class="sidebar-icon" />
        </router-link>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHome, faFile, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import logo from "./assets/logo-PLN.png";
import profile from "./assets/5856.jpg";

library.add(faHome, faFile, faBell, faAngleDown);
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.navbar {
  height: 4.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #009fb5, #015065);
  padding: 0;
  box-shadow: none;
  color: white;
}

.content-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin: 0 1.25em;
}

.content-left {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.content-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 2.5em;
  height: auto;
  margin-right: 1em;
}

.logo-text {
  margin-left: 0.5em;
  letter-spacing: 0.125em;
  font-weight: bold;
  color: white;
}

.navbar-icon {
  font-size: 1em;
}

.angle-down-icon {
  font-size: 0.75em;
}

.profile {
  display: flex;
  align-items: center;
  margin: 0 1.25em;
}

.profile-pict {
  width: 2.5em;
  border-radius: 50%;
  margin: 0 0.5em;
}

.profile-name {
  font-size: 0.85em;
}

.body-container {
  display: flex;
  min-height: calc(100vh - 6.25em);
  margin-top: 0;
}

.sidebar {
  display: flex;
  width: 4.25em;
  box-shadow: 0.5em 0 1em rgba(0, 0, 0, 0.1);
  flex-direction: column;
  padding-top: 1.5em;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  margin: 0.25em 0.75em;
  border-radius: 0.5em;
  color: gray;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar-item:hover {
  color: white;
  background-color: #027887;
}

.sidebar-icon {
  font-size: 1em;
}

.main-content {
  flex: 1;
  margin: 1.5em;
  overflow-y: auto;
}
</style>
