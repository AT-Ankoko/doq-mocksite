<template>
  <v-container>
    <v-row no-gutters justify="center" class="margin-88 | margin-top-100">
      <v-img 
      src="@/assets/logo.svg"
      :width="207" :height="71"
      min-width="207px" min-height="72px" 
      ></v-img>
    </v-row>
    <v-row no-gutters justify="center" class="margin-88px | mt-2">
      <v-col class="title-text-sub">
        한 장의 이미지로 룸메이트 구하기!
      </v-col>
    </v-row>

    <v-card
      class="mx-auto | margin-top-56 | pt-2 pl-4 pr-4"
      max-width="320" rounded="lg"
    >
      <v-card-title class="card-title-text">
        <v-icon icon="mdi-information | pb-1 | mr-1"></v-icon>
        응답내용 수집 안내
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div style="text-align: left; letter-spacing: -0.5px;">
          본 서비스는 품질 향상과 인사이트 도출을 위해 
          응답을 수집하여 통계 및 분석에 활용합니다. 
          <br>위 내용은 해당 목적 외에는 사용되지 않으며, 
          관련 법령을 준수하여 안전하게 관리됩니다.
        </div>
      </v-card-text>
    </v-card>

    <v-row 
      no-gutters justify="center" class="margin-42 | mt-12"
    >
      <v-col class="pa-0 | text-center">
        <div class="speech-bubble | float-animation">
          👇 이미 작성한 글이 있다면 👇
        </div>
        <v-btn 
          @click="handleClickTextToImgBtn"
          variant="flat" color="#FF6161" rounded="xl" size="large" width="100%" height="52px"
          class="text-btn"
        >
          텍스트 입력하여 제작
        </v-btn>
      </v-col>
    </v-row>

    <div style="font-size: 15px; margin: 10px auto; text-align: center;">혹은</div>
    
    <v-row 
      no-gutters justify="center" class="margin-42 | mt-2"
    >
      <v-btn 
        @click="handleClickStartBtn"
        variant="flat" color="#FF6161" rounded="xl" size="large" width="80%" height="32px"
        class="text-small-btn"
      >
        직접 체크하여 제작
      </v-btn>
    </v-row>
    <!-- <v-row 
      v-else="sNewStart"
      no-gutters justify="center" class="margin-42 | mt-12"
    >
      <v-btn 
        @click="handleClickRestartBtn"
        variant="flat" color="#666666" rounded="xl" size="large" width="100%" height="52px"
        class="text-btn"
      >
        다시 시작
      </v-btn>
    </v-row> -->
    <!-- <v-row 
      v-if="sCtnStart"
      no-gutters justify="center" class="margin-42 | mt-2"
    >
      <v-btn 
        @click="handleClickContBtn"
        variant="flat" color="#FF6161" rounded="xl" size="large" width="100%" height="52px"
        class="text-btn"
      >
        이어하기
      </v-btn>
    </v-row> -->
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import { el } from "vuetify/locale";

const emit = defineEmits(['hide-appbar', 'start-survey', 'restart-survey', 'continue-survey']);


// ----- 라이프 사이클 ----- //
onMounted(() => {
  emit('hide-appbar'); 
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 0}));
  console.log("set localStorage userProgress:", localStorage.getItem('userProgress'));

  // if (localStorage.getItem('appInitialized') === 'true') {
  //   sCtnStart.value = true;
  // } else {
  //   sCtnStart.value = false;
  // }

});

onUnmounted(() => {

})

const sNewStart = ref(true);
const sCtnStart = ref(false);

// ----- 함수 정의 ----- //
const router = useRouter();

// 텍스트로 제작
function handleClickTextToImgBtn() {
  router.push('/text2img');
}

// 설문 시작
function handleClickStartBtn() {
  localStorage.setItem('appInitialized', 'false');
  localStorage.setItem('surveyId', null);
  console.log("emitting start-survey event.");
  emit('start-survey');
}

// 다시 시작
function handleClickRestartBtn() {
  localStorage.setItem('appInitialized', 'false');
  localStorage.setItem('surveyId', null);
  console.log("emitting restart-survey event.");
  emit('restart-survey'); 
}

// 이어서 작성하기
function handleClickContBtn() {
  console.log("emitting continue-survey event.");
  emit('continue-survey'); 
  // const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
  // const currentStep = userProgress.currentStep || 0; // 기본값 0
  // emit('continue-survey', { currentStep });
  // console.log("Current Step sent with continue-survey:", currentStep);

}


</script>

<style scoped>
.margin-top-100 {
  margin-top: 100px;
}

.margin-42 {
  margin-left: 42px;
  margin-right: 42px;
}

.margin-top-56 {
  margin-top: 56px;
}

.margin-88 {
  margin-left: 88px;
  margin-right: 88px;
}

.title-text-sub {
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.5px;
}

.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.text-small-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.4px;
}

.text-btn:hover {
  transform: scale(1.05);
}

.card-title-text {
  padding-left: 8px;
  color: #000000 !important; /* 아이콘 색상 */
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.speech-bubble {
  position: relative;
  background-color: #FFFFFF;
  color: #000000;
  border: 0.5px solid #C0C0C0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 22px; /* Increased margin for tail */
  font-size: 13px;
  font-weight: 500;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

/* Tail border */
.speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #C0C0C0;
}

/* Tail fill */
.speech-bubble::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10.5px solid transparent;
  border-right: 10.5px solid transparent;
  border-top: 10.5px solid #FFFFFF;
  margin-top: -1.5px; 
  z-index: 1; 
}

.float-animation {
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(1px);
  }
  50% {
    transform: translateY(-1px);
  }
  100% {
    transform: translateY(1px);
  }
}

</style>