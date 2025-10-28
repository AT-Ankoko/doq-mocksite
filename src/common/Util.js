const Util = (function () {
    // 싱글톤 인스턴스
    let instance;

    // 인스턴스 생성 함수
    function createInstance() {
        return {
            
            parseDrinkFormat(drink) {
                if (!drink) return "선택안함";  // 기본값 설정
              
                const parts = drink.split('-');  // 'ab-c-de'를 '-'로 분리
                if (parts.length !== 3) return "선택안함";  // 형식이 맞지 않는 경우 기본값 반환
              
                // 정수 변환을 사용해 앞자리 '0' 제거
                const ab = parseInt(parts[0], 10);  // 'ab' 정수로 변환하여 앞자리 '0' 제거
                const c = parseInt(parts[1], 10);  // 'c' 정수로 변환
                const de = parseInt(parts[2], 10);  // 'de' 정수로 변환하여 앞자리 '0' 제거
              
                // 'c'의 값에 따라 '일', '개월', '년', '주' 단위 결정
                let unit;
                switch (c) {
                  case 0:
                    unit = "주";
                    break;
                  case 1:
                    unit = "달";
                    break;
                  // case 2:
                  //   unit = "년";
                  //   break;
                  default:
                    unit = "주";  // 기본값 설정
                }
              
                return `${ab}${unit}에 ${de}번`;
            },

            parseSmokeStatus(value) {
                switch (value) {
                  case 0:
                    return "비흡연자";
                  case 1:
                    return "흡연자(연초)";
                  case 2:
                    return "흡연자(전자담배)";
                  default:
                    return "비흡연자";  // 기본값 설정
                }
            },

            parseSleepHabit(value) {
                switch (value) {
                  case 0:
                    return "없음";
                  case 1:
                    return "잠꼬대";
                  case 2:
                    return "코골이";
                  case 3:
                    return "이갈이";
                  case 4:
                    return "불규칙한 수면패턴";
                  default:
                    return "없음";  // 기본값 설정
                }
            },

            parseCollege(value) {
                switch (value) {
                    case 0:
                    return "비공개";
                    case 1:
                    return "예술대학";
                    case 2:
                    return "체육대학";
                    case 3:
                    return "예술공학대학";
                    case 4:
                    return "생명공학대학";
                    case 5:
                    return "공과대학";
                    default:
                    return "비공개"; 
                }
            },
            
            generateTitle(item) {
                console.log('Input item:', item); // 로그 출력을 좀 더 명확하게 변경했습니다.
              
                let prefix = "무던한"; 
                let prefixId = "MU"; 
                let suffix = "보통새";
                let suffixId = "standard";
              
                // 설문 결과에서 값을 추출
                const { clean, eatIn, noise, share, home, selectTag, wakeUp, bedTime } = item;
              
                // 평균 계산을 위한 함수
                const average = (...nums) => nums.reduce((a, b) => a + b, 0) / nums.length;
              
                // 성격 태그 조건 검사
                const isNeat = eatIn <= 1 || clean >= 3;
                const isCasual = share >= 3 && (noise >= 2 || clean >= 2) && selectTag.length <= 1;
                const isLively = (noise >= 3 && home <= 1) || noise >= 3;
                const isQuiet = (home >= 3 && average(share, noise) <= 1) || average(share, noise) <= 1;
                const isDetailed = noise <= 1 && clean >= 3 || selectTag.length >= 4;
              
                if (isLively) {
                  prefix = "흥많은";
                  prefixId = "HE";
                } else if (isQuiet) {
                  prefix = "조용한";
                  prefixId = "JO";
                } else if (isNeat) {
                  prefix = "깔끔한";
                  prefixId = "KK";
                } else if (isDetailed) {
                  prefix = "세심한";
                  prefixId = "SE";
                } else if (isCasual) {
                  prefix = "무던한";
                  prefixId = "MU";
                }
              
                // 기상 및 취침 시각 추출
                const wakeupHour = parseInt(wakeUp.split(':')[0], 10);
                let bedTimeHour = parseInt(bedTime.split(':')[0], 10);

                // 0시는 24시로 취급
                if (bedTimeHour === 24) {
                  bedTimeHour = 0;
                }
              
                // 1) 각 태그에 대한 점수 계산
                const scoreOwl = (bedTimeHour >= 0 && bedTimeHour < 6)
                  ? (1 + bedTimeHour)     // 0시 혹은 24시에 취침하면 1점, 5시에 취침하면 6점
                  : 0;
              
                const scoreBaby = (bedTimeHour >= 20 && bedTimeHour < 23)
                  ? (26 - bedTimeHour)    // 20시면 6점, 22시면 4점
                  : 0;
              
                const scoreMorning = (wakeupHour >= 4 && wakeupHour <= 8)
                  ? (9 - wakeupHour)  // 4시면 5점, 8시면 1점
                  : 0;
              
                const scoreSleep = (wakeupHour >= 10 && wakeupHour < 15)
                  ? (wakeupHour - 8)      // 10시면 2점, 14시면 6점
                  : 0;
              
                // 그냥새는 기본 0점, 혹은 다른 계산 로직을 추가해도 됨
                const scoreStandard = (wakeupHour >= 8 && wakeupHour <= 9 && bedTimeHour >= 23 && bedTimeHour <= 24)
                ? 2    // 8-9시 기상, 11-12시 취침 시 3점
                : 0;    // 그 외의 시간은 기본 1점
              
                // 2) 서브픽스를 객체 리스트로 관리
                const suffixOptions = [
                  { tag: "올빼미",   id: "owl",      score: scoreOwl },
                  { tag: "아기새",   id: "baby",     score: scoreBaby },
                  { tag: "아침새",   id: "morning",  score: scoreMorning },
                  { tag: "늦잠새",   id: "sleep",    score: scoreSleep },
                  { tag: "보통새",   id: "standard", score: scoreStandard },
                ];
              
                // 3) 점수 확인 (디버깅용)
                console.log("Suffix Scores:", {
                  scoreOwl,
                  scoreBaby,
                  scoreMorning,
                  scoreSleep,
                  scoreStandard,
                });
              
                // 4) 가장 높은 점수를 가진 서브픽스 결정
                const bestSuffix = suffixOptions.reduce((best, current) =>
                  current.score > best.score ? current : best
                );
              
                suffix = bestSuffix.tag;
                suffixId = bestSuffix.id;
              
                console.log(`${suffix}:  wakeupHour ${wakeupHour}  bedTimeHour ${bedTimeHour}`)
              
                return { title: `${prefix} ${suffix}`, titleId: `${prefixId}_${suffixId}` };
              }              

        };
    }

    return {
        // 싱글톤 인스턴스를 반환
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

export default Util;

// 사용 예시
// Vue 컴포넌트에서 가져오기:
// const util = Util.getInstance();
// 유효성 검사 호출: util.isNumeric("123"), util.formatPhoneNumber("1234567890")

// 혹은 Util.getInstance().isNumeric("123") 로 바로 사용 가능