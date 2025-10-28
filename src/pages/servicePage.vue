<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 왼쪽: 플로우차트 & 시나리오 선택 -->
    <div class="w-80 bg-white border-r flex flex-col overflow-y-auto">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-bold text-gray-900">워크플로우</h2>
        <p class="text-sm text-gray-500 mt-1">대화 흐름도</p>
      </div>

      <!-- 시나리오 선택 탭 -->
      <div class="px-6 py-4 border-b bg-gray-50">
        <div class="space-y-2">
          <button
            v-for="(scenario, idx) in scenarios"
            :key="idx"
            @click="loadScenario(idx)"
            :class="[
              'w-full text-left p-3 rounded-lg border-2 transition-all',
              currentScenario === idx
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            ]"
          >
            <div class="flex items-start gap-2">
              <svg
                :class="[
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  currentScenario === idx ? 'text-blue-600' : 'text-gray-400'
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <div>
                <div
                  :class="[
                    'text-sm font-semibold',
                    currentScenario === idx ? 'text-blue-900' : 'text-gray-900'
                  ]"
                >
                  {{ scenario.title }}
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ scenario.description }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 플로우 블록 -->
      <div class="px-6 py-6 space-y-3">
        <div v-for="(step, idx) in scenarios[currentScenario].steps" :key="step.id">
          <button
            @click="handleStepClick(step.id)"
            :class="[
              'w-full text-left p-4 rounded-lg transition-all',
              selectedStep === step.id
                ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                : 'hover:shadow-md',
              step.color,
              'text-white'
            ]"
          >
            <div class="flex items-center gap-2 mb-1">
              <div class="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xs font-bold">
                {{ idx + 1 }}
              </div>
              <div class="font-semibold text-sm">{{ step.label }}</div>
            </div>
            <div class="text-xs opacity-90 ml-8">{{ step.subtitle }}</div>
          </button>
          
          <!-- 연결선 -->
          <div v-if="idx < scenarios[currentScenario].steps.length - 1" class="flex justify-center py-1">
            <div class="w-0.5 h-4 bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 중앙: 채팅 영역 -->
    <div class="flex-1 flex flex-col">
      <!-- 헤더 -->
      <div class="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">DoQ</h1>
            <p class="text-sm text-gray-500">용역계약서 작성 도우미</p>
          </div>
        </div>
        <div class="text-sm">
          <span class="font-medium text-gray-900">{{ scenarios[currentScenario].name }}</span>
          <span class="text-gray-500 ml-2">• {{ scenarios[currentScenario].title }}</span>
        </div>
      </div>

      <!-- 메시지 영역 -->
      <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4" ref="messagesContainer">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-2xl rounded-2xl px-4 py-3 shadow-sm',
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'
            ]"
          >
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
            
            <div v-if="msg.options" class="mt-3 space-y-2">
              <button
                v-for="(option, optIdx) in msg.options"
                :key="optIdx"
                @click="handleOptionClick(option)"
                class="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm transition-colors"
              >
                {{ optIdx + 1 }}. {{ option }}
              </button>
            </div>
            
            <div v-if="msg.confirmed" class="mt-2 flex items-center gap-1 text-green-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-xs font-medium">조항 확정됨</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 입력 영역 -->
      <div class="bg-white border-t px-6 py-4">
        <div class="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            v-model="inputValue"
            @keypress.enter="handleSend"
            placeholder="메시지를 입력하세요..."
            class="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="handleSend"
            class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 오른쪽: 문서 미리보기 -->
    <div class="w-96 bg-white border-l flex flex-col">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-bold text-gray-900">계약서 미리보기</h2>
        <p class="text-sm text-gray-500 mt-1">실시간으로 업데이트됩니다</p>
      </div>
      
      <div class="flex-1 overflow-y-auto px-6 py-6">
        <div class="space-y-6 text-sm">
          <div class="text-center pb-4 border-b">
            <h3 class="text-xl font-bold text-gray-900">용역 계약서</h3>
          </div>

          <div>
            <p class="text-gray-600 leading-relaxed">
              의뢰인(이하 "갑")과 작업자(이하 "을")는 다음과 같이 용역 계약을 체결한다.
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <h4 class="font-bold text-gray-900 mb-2">제1조 (목적)</h4>
              <p class="text-gray-600 leading-relaxed">
                본 계약은 갑이 을에게 의뢰한 용역의 수행에 관한 제반사항을 정함을 목적으로 한다.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 mb-2">제2조 (용역의 내용)</h4>
              <p class="text-gray-600 leading-relaxed">
                {{ contractData.workContent || '(작성 중)' }}
              </p>
            </div>

            <div :class="contractData.period ? 'bg-yellow-50 p-3 rounded-lg' : ''">
              <h4 class="font-bold text-gray-900 mb-2">제3조 (용역 기간)</h4>
              <p class="text-gray-600 leading-relaxed">
                {{ contractData.period || '(작성 중)' }}
              </p>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 mb-2">제4조 (계약 대금)</h4>
              <p class="text-gray-600 leading-relaxed">
                {{ contractData.payment || '(작성 중)' }}
              </p>
            </div>

            <div :class="contractData.copyright ? 'bg-yellow-50 p-3 rounded-lg' : ''">
              <h4 class="font-bold text-gray-900 mb-2">제5조 (지식재산권)</h4>
              <p class="text-gray-600 leading-relaxed">
                {{ contractData.copyright || '(작성 중)' }}
              </p>
            </div>

            <div>
              <h4 class="font-bold text-gray-900 mb-2">제6조 (기타사항)</h4>
              <p class="text-gray-600 leading-relaxed">
                본 계약서에 명시되지 않은 사항은 관련 법령 및 상관례에 따른다.
              </p>
            </div>
          </div>

          <div class="pt-8 space-y-4 text-center border-t">
            <p class="text-gray-600">20__년 __월 __일</p>
            <div class="space-y-2">
              <p class="text-gray-900 font-medium">갑 (의뢰인): _______________ (인)</p>
              <p class="text-gray-900 font-medium">을 (작업자): _______________ (인)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractChatPlatform',
  data() {
    return {
      messages: [],
      inputValue: '',
      currentScenario: 0,
      selectedStep: null,
      contractData: {},
      scenarios: [
        // 시나리오 1: 명확한 자연어 제시
        {
          name: '시나리오 1',
          title: '명확한 자연어 제시',
          description: '사용자가 구체적인 날짜나 정보를 명확하게 제공',
          steps: [
            { id: 1, type: 'start', label: 'AI 조항 질문', subtitle: '작업 기간은?', color: 'bg-blue-500' },
            { id: 2, type: 'user', label: 'User 명확한 응답', subtitle: '11/1 ~ 11/14', color: 'bg-green-500' },
            { id: 3, type: 'ai', label: 'AI 변환 및 확인', subtitle: '맞으신가요?', color: 'bg-purple-500' },
            { id: 4, type: 'user', label: 'User 수락', subtitle: '네, 맞아요', color: 'bg-green-500' },
            { id: 5, type: 'end', label: '조항 확정', subtitle: '완료', color: 'bg-emerald-600' }
          ],
          messages: [
            { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안 작성을 시작하겠습니다. 먼저, 용역(작업) 기간은 언제인가요?', stepId: 1 },
            { role: 'user', content: '11월 1일부터 11월 14일까지요.', stepId: 2 },
            { role: 'ai', content: '네. 제3조 (용역 기간) 항목에 "2024년 11월 1일부터 2024년 11월 14일까지 (총 14일)"로 명시합니다. 이 내용이 맞으신가요?', needsConfirm: true, stepId: 3 },
            { role: 'user', content: '네, 맞아요.', stepId: 4 },
            { role: 'ai', content: '좋습니다. \'용역 기간\' 조항이 확정되었습니다. 다음으로, 계약 \'대금\'은 얼마로 정하셨나요?', confirmed: true, stepId: 5 }
          ],
          contractUpdate: { period: '2024년 11월 1일부터 2024년 11월 14일까지 (총 14일)' }
        },
        // 시나리오 2: 모호한 응답
        {
          name: '시나리오 2',
          title: '모호한 응답',
          description: '사용자가 모호한 답변을 하여 명확화 필요',
          steps: [
            { id: 1, type: 'start', label: 'AI 조항 질문', subtitle: '작업 기간은?', color: 'bg-blue-500' },
            { id: 2, type: 'user', label: 'User 모호한 응답', subtitle: '2주 정도...', color: 'bg-yellow-500' },
            { id: 3, type: 'ai', label: 'AI 다지선다 제공', subtitle: '옵션 선택', color: 'bg-purple-500' },
            { id: 4, type: 'user', label: 'User 옵션 선택', subtitle: '2번 선택', color: 'bg-green-500' },
            { id: 5, type: 'end', label: '조항 확정', subtitle: '완료', color: 'bg-emerald-600' }
          ],
          messages: [
            { role: 'ai', content: '안녕하세요, DoQ입니다. 계약서 초안 작성을 시작하겠습니다. 먼저, 용역(작업) 기간은 언제인가요?', stepId: 1 },
            { role: 'user', content: '음... 다음 주부터 한 2주 정도 걸릴 것 같아요.', stepId: 2 },
            { 
              role: 'ai', 
              content: '\'2주\'의 기준을 명확히 하는 것이 좋습니다. 다음 중 어떤 것을 의미하시나요?',
              options: [
                '계약 체결일(오늘)로부터 14일',
                '작업 착수일(다음 주 월요일)로부터 14일',
                '기타 (직접 입력)'
              ],
              stepId: 3
            },
            { role: 'user', content: '2번으로 할게요.', stepId: 4 },
            { role: 'ai', content: '알겠습니다. 제3조 (용역 기간) 항목에 "작업 착수일(YYYY년 MM월 DD일)로부터 14일"로 명시합니다. 조항이 확정되었습니다. 다음으로, 계약 \'대금\'은 얼마로 정하셨나요?', confirmed: true, stepId: 5 }
          ],
          contractUpdate: { period: '작업 착수일(YYYY년 MM월 DD일)로부터 14일' }
        },
        // 시나리오 3: 용어 질문
        {
          name: '시나리오 3',
          title: '용어 질문',
          description: '사용자가 용어나 개념에 대해 질문',
          steps: [
            { id: 1, type: 'start', label: 'AI 조항 질문', subtitle: '저작권은?', color: 'bg-blue-500' },
            { id: 2, type: 'user', label: 'User 용어 질문', subtitle: '그게 뭐예요?', color: 'bg-orange-500' },
            { id: 3, type: 'ai', label: 'AI 용어 설명', subtitle: '개념 안내', color: 'bg-pink-500' },
            { id: 4, type: 'ai', label: 'AI 질문 재제시', subtitle: '다시 질문', color: 'bg-purple-500' },
            { id: 5, type: 'user', label: 'User 옵션 선택', subtitle: '1번 선택', color: 'bg-green-500' },
            { id: 6, type: 'end', label: '조항 확정', subtitle: '완료', color: 'bg-emerald-600' }
          ],
          messages: [
            { role: 'ai', content: '이어서 지식재산권(저작권) 귀속 조항을 정하겠습니다. 작업하신 산출물의 저작권은 누가 가지게 되나요?', stepId: 1 },
            { role: 'user', content: '\'저작권 귀속\'이 정확히 무슨 뜻이에요?', stepId: 2 },
            { role: 'ai', content: '\'저작권 귀속\'이란, 완성된 작업물(예: 디자인 시안, 코드)을 법적으로 소유하고 자유롭게 사용할 수 있는 권리가 누구에게 있는지를 정하는 것입니다.', stepId: 3 },
            { 
              role: 'ai', 
              content: '다시 질문드립니다. 완성된 작업물의 저작권은 누가 가지게 되나요?',
              options: [
                '의뢰인 (돈을 주는 사람)',
                '작업자 (본인)',
                '공동 소유'
              ],
              stepId: 4
            },
            { role: 'user', content: '아, 이해했어요. 1번, 의뢰인이 갖는 걸로 해주세요.', stepId: 5 },
            { role: 'ai', content: '네. "모든 산출물의 지식재산권은 \'의뢰인(갑)\'에게 귀속된다"로 명시합니다. 조항이 확정되었습니다. 다음으로...', confirmed: true, stepId: 6 }
          ],
          contractUpdate: { copyright: '모든 산출물의 지식재산권은 \'의뢰인(갑)\'에게 귀속됨' }
        }
      ]
    };
  },
  mounted() {
    this.loadScenario(0);
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    loadScenario(index) {
      this.messages = [...this.scenarios[index].messages];
      this.contractData = { ...this.contractData, ...this.scenarios[index].contractUpdate };
      this.currentScenario = index;
      this.selectedStep = null;
    },
    handleStepClick(stepId) {
      this.selectedStep = stepId;
      const filteredMessages = this.scenarios[this.currentScenario].messages.filter(
        msg => msg.stepId <= stepId
      );
      this.messages = [...filteredMessages];
    },
    handleSend() {
      if (!this.inputValue.trim()) return;
      
      const newMessage = { role: 'user', content: this.inputValue };
      this.messages.push(newMessage);
      this.inputValue = '';
    },
    handleOptionClick(option) {
      const newMessage = { role: 'user', content: option };
      this.messages.push(newMessage);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }
};
</script>

<style scoped>
/* Tailwind CSS classes are used, ensure Tailwind is configured in your project */
</style>