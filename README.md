# 🎉 Animated C Code Editor

> **React + Vite + Tailwind** 로 만든 **실시간 C 코드 편집기**
> 화면에 입력한 C 코드를 바로 실행 결과와 함께 보여주는 간단한 예시 프로젝트예요.

## 📖 소개
- **React 19**와 **Vite 7**을 사용해 빠른 개발 환경 제공
- **TailwindCSS**와 `tailwind-merge` 로 깔끔한 UI 구현
- `vite-plugin-singlefile` 으로 **단일 HTML 파일**(GitHub Pages 배포용) 생성 가능
- `src/components/CodeEditor.tsx` 에서 **코드 편집**과 **실행 결과 표시** 로직 구현

> 이 레포는 학습용·데모용이 목적이며, 필요에 따라 기능을 자유롭게 확장해도 돼요.

## 📦 설치 & 로컬 실행
```bash
# 1️⃣ 레포 클론 (또는 다운로드)
git clone https://github.com/<your-github-id>/animated-c-code-editor.git
cd animated-c-code-editor

# 2️⃣ 의존성 설치 (Node ≥ 20 권장)
npm ci      # 또는 npm install

# 3️⃣ 개발 서버 실행
npm run dev
# > 브라우저가 자동으로 http://localhost:5173 으로 열릴 거야
```

### 📂 주요 폴더 구조
```
├─ index.html                # Vite 진입점
├─ package.json              # 스크립트·디펜던시 정의
├─ vite.config.ts            # Vite 설정 (베이스 경로 등)
├─ tailwind.config.cjs       # Tailwind 설정
├─ src/
│   ├─ main.tsx              # React 루트
│   ├─ App.tsx               # 페이지 레이아웃
│   ├─ index.css             # Tailwind import
│   ├─ utils/
│   │   └─ cn.ts             # 클래스 네임 헬퍼
│   └─ components/
│       └─ CodeEditor.tsx    # 핵심 편집기 컴포넌트
```

## 🛠️ 개발 팁
| 스크립트 | 설명 |
|---------|------|
| `npm run dev` | Vite 개발 서버 (hot‑reload) |
| `npm run build` | `dist/` 폴더에 **프로덕션 정적 파일** 생성 |
| `npm run preview` | `dist/` 를 로컬에서 미리 보기 |
| `npm run lint` *(선택)* | `eslint`/`prettier` 설정 시 코드 스타일 검증 |
| `npm run test` *(선택)* | 테스트 프레임워크를 추가했다면 실행 |

> **Tailwind**를 쓰다 보면 `className` 값이 길어질 때가 있어요. `tailwind-merge`가 자동으로 중복·충돌 클래스를 정리해 주니, `cn()` 헬퍼와 함께 쓰면 깔끔해요.

## 📦 배포 – GitHub Pages (가장 쉬운 방법)
### 1️⃣ `gh-pages` 패키지 이용 (수동 배포)
```bash
# 패키지 설치
npm i -D gh-pages

# package.json에 스크립트 추가 (이미 포함돼 있어야 함)
#   "predeploy": "npm run build",
#   "deploy":    "gh-pages -d dist"

# 배포 실행
npm run deploy
```
- 위 명령은 `dist/` 내용을 **`gh-pages` 브랜치**에 푸시하고, GitHub Pages가 자동으로 해당 브랜치를 소스로 사용하게 돼요.

### 2️⃣ GitHub Actions 자동 배포 (추천)
`.github/workflows/gh-pages.yml` 파일을 레포에 추가하고 아래 내용 복사:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]   # main에 푸시될 때마다 실행

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
- `main` 브랜치에 푸시하면 자동으로 **`dist/`** 가 `gh-pages` 브랜치에 배포돼요.
- 레포 **Settings → Pages** 에서 *Source* 를 **GitHub Actions** 로 지정해 주세요.

### 3️⃣ 베이스 경로 설정 (GitHub Pages 서브 폴더)
GitHub Pages는 레포 이름이 서브 경로가 되니, `vite.config.ts` 에 **base** 옵션을 넣어야 할 수도 있어요.
```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 레포 이름과 동일하게 (예: animated-c-code-editor)
  base: "/animated-c-code-editor/",
});
```
> 베이스 경로를 지정하지 않으면 CSS/JS 파일이 404가 될 수 있어요. 배포 후에 정상 동작 여부를 꼭 확인해 주세요.

## 📜 라이선스
이 프로젝트는 **MIT License** 로 배포됩니다.
자유롭게 사용·수정·재배포 가능하지만, 원본 저작권 표시와 라이선스 사본을 함께 넣어 주세요.

## 🤝 기여하기
1. **Fork** → **Clone** → 새 브랜치 만들기 (`feature/…` 혹은 `fix/…`)
2. 코드 수정 → `npm run lint` 로 스타일 체크
3. 커밋 & **Pull Request** 생성

> 작은 개선이라도 환영! 질문·버그 리포트는 **Issues** 에 남겨 주세요.

---
아무쪼록 이 README가 프로젝트 셋업과 배포에 도움이 되길 바라! 궁금한 점 있으면 언제든 물어봐. 🚀