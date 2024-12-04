import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faFile,
  faGear,
  faAngleLeft,
  faAngleRight,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";

library.add(faHome, faFile, faGear, faAngleLeft, faAngleRight, faPlus);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(vuetify);
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
