<template>
  <BoxContainer>
    <SubTitle :title="title" :desc="desc"> </SubTitle>
    <v-row no-gutters justify="start">
      <v-label>흡연여부를 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858" hide-details
        :items="smokeItem"
        v-model="smoke"
      ></v-select>
    </v-row>

    <v-row no-gutters justify="start" class="margin-top-28">
      <v-label>음주 빈도를 입력해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-6">
      <v-col class="d-flex | justify-center | align-center">
        <v-text-field
          variant="underlined" base-color="#FF5858" color="#FF5858" item-color="#FF5858" hide-details
          class="custom-text-field" max-width="40px" min-width="40px"
          placeholder="0"
          v-model="dymCnt"
          maxlength="2"
          @input="dymCnt = isNumeric(dymCnt)"
        ></v-text-field>
        <v-select
          variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858" hide-details
          :items="dmyItem" max-width="80px" min-width="80px"
          class="ml-2 | mr-2"
          v-model="dym"
        ></v-select>
        <v-label>
          에
        </v-label>
        <v-text-field
          variant="underlined" base-color="#FF5858" color="#FF5858" item-color="#FF5858" hide-details
          class="custom-text-field | ml-7 | mr-2" max-width="40px" min-width="40px"
          placeholder="0"
          v-model="drinkCnt"
          maxlength="2"
          @input="drinkCnt = isNumeric(drinkCnt)"
        ></v-text-field>
        <v-label>
          번
        </v-label>
      </v-col>
    </v-row>

    <v-row no-gutters justify="start" class="margin-top-52">
      <label class="custom-label" v-html="'흡연/음주에 대해 하고싶은 말이 있다면 적어주세요'"></label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-text-field
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858"
        placeholder="술 주사, 흡연 습관 등"
        v-model="sdEtc"
        maxlength="30"
      >
        <template v-slot:append-inner>
          <v-label class="count-label" :text="`${sdEtc.length}/30`"></v-label>
        </template>
      </v-text-field>
    </v-row>

  </BoxContainer>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import BoxContainer from "@/components/BoxContainer.vue";

const title = '흡연/음주'
const desc = '자신의 흡연과 음주 습관에 대해 솔직하게 공유해주세요.'

const smoke = ref(0);
const smokeItem = ref([
  { title: '비흡연', value: 0},
  { title: '연초', value: 1},
  { title: '전자담배', value: 2},
]);

const drink = ref(null);
const dymCnt = ref(null);
const dym = ref(0);
const dmyItem = ref([
  { title: '주', value: 0},
  { title: '달', value: 1},
  // { title: '년', value: 2},
]);
const drinkCnt = ref(null);

const sdEtc = ref('');

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {

})

// 변경값 확인 및 업데이트
watch(smoke, (newValue, oldValue) => {
  console.log(`--- smoke changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("smoke", newValue);
});

watch(
  [dymCnt, dym, drinkCnt],
  ([newDymCnt, newDym, newDrinkCnt], [oldDymCnt, oldDym, oldDrinkCnt]) => {
    console.log(`dymCnt changed from ${oldDymCnt} to ${newDymCnt}`);
    console.log(`dym changed from ${oldDym} to ${newDym}`);
    console.log(`drinkCnt changed from ${oldDrinkCnt} to ${newDrinkCnt}`);

    const formattedDrink = `${String(newDymCnt).padStart(2, "0")}-${newDym}-${String(newDrinkCnt).padStart(2, "0")}`;
    drink.value = formattedDrink;
    console.log(`Formatted drink: ${drink.value}`);

    updateLocalStorage("drink", drink.value);
  }
);

watch(sdEtc, (newValue, oldValue) => {
  console.log(`--- sdEtc changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("sdEtc", newValue);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 3}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    smoke.value = survey.smoke || 0;
    drink.value = survey.drink || '00-0-0';

    const parts = drink.value.split('-');  // '00-0-0' 형식을 '-'로 분리
    dymCnt.value = parts.length > 0 ? parseInt(parts[0], 10) : 0;
    dym.value = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    drinkCnt.value = parts.length > 2 ? parseInt(parts[2], 10) : 0;

    sdEtc.value = survey.sdEtc || '';
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

function isNumeric(input) {
  let number = input.replace(/[^0-9]/g, ''); // 숫자만 남기기
  return parseInt(number, 10) || 0; // 선행 0 제거 및 숫자로 변환 후 다시 문자열로
}


</script>

<style scoped>
/* 토글 버튼 아이콘 색상 */
:deep(.v-input__control .v-icon) {
  color: #FF5858 !important; /* 아이콘 색상 */
}

:deep(.v-label) {
  color: #000000;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.custom-label {
  color: #646464;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.count-label {
  color: #000000;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.4px;
}

.padding-0 {
  padding: 0px;
}

.margin-top-28 {
  margin-top: 28px;
}

.margin-top-52 {
  margin-top: 52px;
}
</style>