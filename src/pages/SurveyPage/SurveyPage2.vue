<template>
  <BoxContainer>
    <SubTitle :title="title" :desc="desc"> </SubTitle>

    <v-row no-gutter justify="center">
      <v-col class="d-flex | justify-center | align-center">
        <v-label>내향적</v-label>
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
        ></v-img>
      </v-col>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti0 === 0 ? 'custom-text-on' : 'custom-text-off'"
      >
        I
      </v-col>
      <v-switch
        v-model="mbti0"
        inset hide-details color="#FF6161" base-color="#FF6161" class="mr-5 | ml-5"
        :value="1"
        :false-value="0"
      ></v-switch>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti0 === 1 ? 'custom-text-on' : 'custom-text-off'"
      >
        E
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
          style="transform: scaleX(-1);"
        ></v-img>
      </v-col>
      <v-col class="d-flex | justify-center | align-center">
        <v-label>외향적</v-label>
      </v-col>
    </v-row>

    <v-row no-gutter justify="center" class="margin-top-52">
      <v-col class="d-flex | justify-center | align-center">
        <v-label>이상적</v-label>
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
        ></v-img>
      </v-col>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti1 === 0 ? 'custom-text-on' : 'custom-text-off'"
      >
        N
      </v-col>
      <v-switch
        v-model="mbti1"
        inset hide-details color="#FF6161" base-color="#FF6161" class="mr-5 | ml-5"
        :value="1"
        :false-value="0"
      ></v-switch>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti1 === 1 ? 'custom-text-on' : 'custom-text-off'"
      >
        S
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
          style="transform: scaleX(-1);"
        ></v-img>
      </v-col>
      <v-col class="d-flex | justify-center | align-center">
        <v-label>현실적</v-label>
      </v-col>
    </v-row>

    <v-row no-gutter justify="center" class="margin-top-52">
      <v-col class="d-flex | justify-center | align-center">
        <v-label>사고형</v-label>
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
        ></v-img>
      </v-col>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti2 === 0 ? 'custom-text-on' : 'custom-text-off'"
      >
        T
      </v-col>
      <v-switch
        v-model="mbti2"
        inset hide-details color="#FF6161" base-color="#FF6161" class="mr-5 | ml-5"
        :value="1"
        :false-value="0"
      ></v-switch>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti2 === 1 ? 'custom-text-on' : 'custom-text-off'"
      >
        F
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
          style="transform: scaleX(-1);"
        ></v-img>
      </v-col>
      <v-col class="d-flex | justify-center | align-center">
        <v-label>감정형</v-label>
      </v-col>
    </v-row>

    <v-row no-gutter justify="center" class="margin-top-52">
      <v-col class="d-flex | justify-center | align-center">
        <v-label>계획성</v-label>
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
        ></v-img>
      </v-col>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti3 === 0 ? 'custom-text-on' : 'custom-text-off'"
      >
        J
      </v-col>
      <v-switch
        v-model="mbti3"
        inset hide-details color="#FF6161" base-color="#FF6161" class="mr-5 | ml-5"
        :value="1"
        :false-value="0"
      ></v-switch>
      <v-col 
        class="d-flex | justify-center | align-center | padding-0"
        :class="mbti3 === 1 ? 'custom-text-on' : 'custom-text-off'"
      >
        P
      </v-col>
      <v-col class="d-flex | justify-center | align-center | padding-0">
        <v-img 
          src="@/assets/line.svg"
          :width="30"
          max-width="40px"
          style="transform: scaleX(-1);"
        ></v-img>
      </v-col>
      <v-col class="d-flex | justify-center | align-center">
        <v-label>융통성</v-label>
      </v-col>
    </v-row>
    
  </BoxContainer>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"

import BoxContainer from "@/components/BoxContainer.vue";

const title = 'MBTI'
const desc = '현대인의 필수 정보 MBTI를 빼먹을 수 없죠.<br>나의 성격을 간단히 표현해주세요.'

const mbti0 = ref(0); // 0: I, 1: E
const mbti1 = ref(0); // 0: N, 1: S
const mbti2 = ref(0); // 0: T, 1: F
const mbti3 = ref(0); // 0: J, 1: P

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {

})

// 변경값 확인 및 업데이트
watch([mbti0, mbti1, mbti2, mbti3], () => {
  const mbtiString = formatMbtiString();
  console.log(`--- MBTI updated to: ${mbtiString}`);
  updateLocalStorage("mbti", mbtiString);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 2}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    const mbtiString = survey.mbti || "INTJ";
    mbti0.value = mbtiString[0] === "I" ? 0 : 1;
    mbti1.value = mbtiString[1] === "N" ? 0 : 1;
    mbti2.value = mbtiString[2] === "T" ? 0 : 1;
    mbti3.value = mbtiString[3] === "J" ? 0 : 1;
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

// mbti문자열로 포맷팅
function formatMbtiString() {
  const parts = [
    mbti0.value === 0 ? "I" : "E",
    mbti1.value === 0 ? "N" : "S",
    mbti2.value === 0 ? "T" : "F",
    mbti3.value === 0 ? "J" : "P",
  ];
  return parts.join("");
}



</script>

<style scoped>
:deep(.v-label) {
  color: #000000;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.4px;
}

.custom-text-on {
  color: #666666;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
}
.custom-text-off {
  color: #CCCCCC;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
}

.padding-0 {
  padding: 0px;
}

.margin-top-52 {
  margin-top: 52px;
}
</style>