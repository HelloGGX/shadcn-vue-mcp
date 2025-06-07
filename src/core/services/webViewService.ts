import { marked } from 'marked';
import open from 'open';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class WebViewService {
  /**
   * 创建HTML页面并在浏览器中打开展示markdown内容
   * @param markdownContent markdown内容
   * @param title 页面标题
   */
  static async openMarkdownInBrowser(markdownContent: string, title: string = 'Component Documentation'): Promise<void> {
    try {
      // 将markdown转换为HTML
      const htmlContent = await marked(markdownContent);
      
      // 创建完整的HTML页面
      const fullHtml = this.createHtmlPage(htmlContent, title);
      
      // 创建临时文件
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `component-doc-${Date.now()}.html`);
      
      // 写入HTML文件
      fs.writeFileSync(tempFilePath, fullHtml, 'utf8');
      
      // 在浏览器中打开
      await open(tempFilePath);
      
      console.log(`Documentation opened in browser: ${tempFilePath}`);
    } catch (error) {
      console.error('Error opening markdown in browser:', error);
      throw error;
    }
  }

  /**
   * 创建完整的HTML页面
   * @param htmlContent 已转换的HTML内容
   * @param title 页面标题
   * @returns 完整的HTML页面字符串
   */
  private static createHtmlPage(htmlContent: string, title: string): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        :root {
            --primary-color: #6366f1;
            --primary-light: #818cf8;
            --primary-dark: #4f46e5;
            --secondary-color: #f1f5f9;
            --accent-color: #06b6d4;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-muted: #94a3b8;
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --bg-tertiary: #f1f5f9;
            --border-color: #e2e8f0;
            --border-light: #f1f5f9;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            --radius-sm: 0.375rem;
            --radius-md: 0.5rem;
            --radius-lg: 0.75rem;
            --radius-xl: 1rem;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.7;
            color: var(--text-primary);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 1rem;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .content {
            padding: 3rem;
            background: var(--bg-primary);
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: var(--text-primary);
            font-weight: 600;
            line-height: 1.4;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .content h1 {
            font-size: 2.25rem;
            color: var(--primary-color);
            border-bottom: 3px solid var(--primary-color);
            padding-bottom: 0.75rem;
            margin-bottom: 2rem;
        }
        
        .content h2 {
            font-size: 1.875rem;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .content h3 {
            font-size: 1.5rem;
            color: var(--primary-dark);
        }
        
        .content h4 {
            font-size: 1.25rem;
            color: var(--text-primary);
        }
        
        p {
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
            line-height: 1.8;
        }
        
        code {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: var(--primary-dark);
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid var(--border-light);
        }
        
        pre {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: #e2e8f0;
            padding: 2rem;
            border-radius: var(--radius-lg);
            overflow-x: auto;
            margin: 2rem 0;
            box-shadow: var(--shadow-lg);
            border: 1px solid #334155;
            position: relative;
        }
        
        pre::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color), var(--primary-light));
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
            border: none;
            font-size: 0.875rem;
            line-height: 1.6;
        }
        
        blockquote {
            border-left: 4px solid var(--primary-color);
            margin: 2rem 0;
            padding: 1.5rem 2rem;
            background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
            box-shadow: var(--shadow-sm);
            position: relative;
        }
        
        blockquote::before {
            content: '"';
            font-size: 4rem;
            color: var(--primary-color);
            position: absolute;
            top: -0.5rem;
            left: 1rem;
            opacity: 0.3;
            font-family: Georgia, serif;
        }
        
        blockquote p {
            color: var(--text-secondary);
            font-style: italic;
            margin: 0;
            position: relative;
            z-index: 1;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            background: var(--bg-primary);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-md);
        }
        
        th, td {
            padding: 1rem 1.5rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        th {
            background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        tr:hover {
            background: var(--bg-secondary);
            transition: background-color 0.2s ease;
        }
        
        tr:last-child td {
            border-bottom: none;
        }
        
        a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
            position: relative;
        }
        
        a:hover {
            color: var(--primary-dark);
            text-decoration: underline;
            text-decoration-color: var(--primary-color);
            text-underline-offset: 3px;
        }
        
        ul, ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
            line-height: 1.7;
        }
        
        li::marker {
            color: var(--primary-color);
        }
        
        .timestamp {
            background: var(--bg-secondary);
            color: var(--text-muted);
            font-size: 0.875rem;
            text-align: center;
            padding: 2rem;
            border-top: 1px solid var(--border-color);
            font-weight: 500;
        }
        
        .copy-button {
            position: absolute !important;
            top: 1rem !important;
            right: 1rem !important;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%) !important;
            color: white !important;
            border: none !important;
            padding: 0.5rem 1rem !important;
            border-radius: var(--radius-md) !important;
            cursor: pointer !important;
            font-size: 0.75rem !important;
            font-weight: 500 !important;
            opacity: 0.8 !important;
            transition: all 0.2s ease !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: var(--shadow-sm) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
        }
        
        .copy-button:hover {
            opacity: 1 !important;
            transform: translateY(-1px) !important;
            box-shadow: var(--shadow-md) !important;
        }
        
        .copy-button:active {
            transform: translateY(0) !important;
        }
        
        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
            border-radius: var(--radius-sm);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
            border-radius: var(--radius-sm);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 1rem 0.5rem;
            }
            
            .container {
                border-radius: var(--radius-lg);
            }
            
            .header {
                padding: 2rem 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 2rem 1.5rem;
            }
            
            .content h1 {
                font-size: 1.875rem;
            }
            
            .content h2 {
                font-size: 1.5rem;
            }
            
            pre {
                padding: 1.5rem;
                font-size: 0.8rem;
                margin: 1.5rem 0;
            }
            
            table {
                font-size: 0.875rem;
            }
            
            th, td {
                padding: 0.75rem 1rem;
            }
        }
        
        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.75rem;
            }
            
            .content {
                padding: 1.5rem 1rem;
            }
            
            pre {
                padding: 1rem;
                font-size: 0.75rem;
            }
            
            .copy-button {
                padding: 0.375rem 0.75rem !important;
                font-size: 0.625rem !important;
            }
        }
        
        /* 动画效果 */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .container {
            animation: fadeIn 0.6s ease-out;
        }
        
        /* 打印样式 */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border: none;
            }
            
            .header {
                background: var(--primary-color) !important;
                -webkit-print-color-adjust: exact;
            }
            
            .copy-button {
                display: none !important;
            }
        }
    </style>
    <!-- 添加Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <!-- 添加代码高亮支持 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        
        <div class="content">
            ${htmlContent}
        </div>
        
        <div class="timestamp">
            Generated on ${new Date().toLocaleString('zh-CN')} • Powered by shadcn/vue MCP Server
        </div>
    </div>
    
    <script>
        // 初始化代码高亮
        hljs.highlightAll();
        
        // 添加复制代码功能
        document.querySelectorAll('pre code').forEach((block) => {
            const button = document.createElement('button');
            button.textContent = 'Copy';
            button.className = 'copy-button';
            
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    button.textContent = 'Failed';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                }
            });
            
            const pre = block.parentElement;
            pre.style.position = 'relative';
            pre.appendChild(button);
        });
        
        // 添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // 添加表格响应式处理
        document.querySelectorAll('table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.style.overflowX = 'auto';
            wrapper.style.margin = '2rem 0';
            wrapper.style.borderRadius = 'var(--radius-lg)';
            wrapper.style.boxShadow = 'var(--shadow-md)';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    </script>
</body>
</html>`;
  }
} 