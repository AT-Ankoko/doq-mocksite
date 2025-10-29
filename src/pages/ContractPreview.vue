<template>
  <div class="preview-sidebar bg-white d-flex flex-column">

    <div class="flex-grow-1 overflow-y-auto px-6 py-6">
      <div class="d-flex flex-column ga-6 text-body-2">
        <div class="text-center pb-4">
          <h3 class="text-h5 font-weight-bold text-grey-darken-4">용역 계약서</h3>
        </div>

        <div>
          <p class="text-grey-darken-2 text-justify">
            의뢰인(이하 "갑")과 작업자(이하 "을")는 다음과 같이 용역 계약을 체결한다.
          </p>
        </div>

        <div class="d-flex flex-column ga-4">
          <div>
            <h4 class="font-weight-bold text-grey-darken-4 mb-2">제1조 (목적)</h4>
            <p class="text-grey-darken-2 text-justify">
              본 계약은 갑이 을에게 의뢰한 용역의 수행에 관한 제반사항을 정함을 목적으로 한다.
            </p>
          </div>

          <div>
            <h4 class="font-weight-bold text-grey-darken-4 mb-2">제2조 (용역의 내용)</h4>
            <p class="text-grey-darken-2 text-justify">
              {{ contractData.workContent || '(작성 중)' }}
            </p>
          </div>

          <div :class="contractData.period ? 'bg-yellow-lighten-4 pa-3 rounded' : ''">
            <h4 class="font-weight-bold text-grey-darken-4 mb-2">제3조 (용역 기간)</h4>
            <p class="text-grey-darken-2 text-justify">
              {{ contractData.period || '(작성 중)' }}
            </p>
          </div>

          <div>
            <h4 class="font-weight-bold text-grey-darken-4 mb-2">제4조 (계약 대금)</h4>
            <p class="text-grey-darken-2 text-justify">
              {{ contractData.payment || '(작성 중)' }}
            </p>
          </div>

          <div :class="contractData.copyright ? 'bg-yellow-lighten-4 pa-3 rounded' : ''">
            <h4 class="font-weight-bold text-grey-darken-4 mb-2">제5조 (지식재산권)</h4>
            <p class="text-grey-darken-2 text-justify">
              {{ contractData.copyright || '(작성 중)' }}
            </p>
          </div>

          <div>
            <h4 class="font-weight-bold text-grey-darken-4 mb-2">제6조 (기타사항)</h4>
            <p class="text-grey-darken-2 text-justify">
              본 계약서에 명시되지 않은 사항은 관련 법령 및 상관례에 따른다.
            </p>
          </div>
        </div>

        <div class="pt-8 d-flex flex-column ga-4 text-center border-t">
          <p class="text-grey-darken-2">20__년 __월 __일</p>
          <div class="d-flex flex-column ga-2">
            <p class="text-grey-darken-3 font-weight-medium">갑 (의뢰인): _______________ (인)</p>
            <p class="text-grey-darken-3 font-weight-medium">을 (작업자): _______________ (인)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  contractData: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
.preview-sidebar {
  width: 384px;
  min-width: 384px;
}
</style>