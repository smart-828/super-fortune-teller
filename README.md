# Super Fortune Teller 命運之鏡

AI 占卜 web app，由 Claude Haiku 驅動。API key 藏喺後端，朋友無法看到。

## 檔案結構

```
super-fortune-teller/
├── api/
│   └── oracle.js        ← Vercel serverless function（後端）
├── public/
│   └── index.html       ← 前端
├── vercel.json          ← Vercel 設定
└── README.md
```

## Deploy 步驟

### 1. GitHub
```bash
cd super-fortune-teller
git init
git add .
git commit -m "Initial commit"
# 喺 GitHub 新建 repo，然後：
git remote add origin https://github.com/smart-828/super-fortune-teller.git
git push -u origin main
```

### 2. Vercel
1. 登入 vercel.com → Import Project → 選 super-fortune-teller repo
2. 入去 Settings → Environment Variables
3. 加一個變數：
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...`（你的 API key）
4. Redeploy

完成！朋友用網址就可以玩，完全唔知你用咩 API key。
