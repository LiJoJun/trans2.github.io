// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> 简介</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="installation.html"><strong aria-hidden="true">1.1.</strong> 安装</a></li><li class="chapter-item expanded "><a href="terminology.html"><strong aria-hidden="true">1.2.</strong> 术语</a></li><li class="chapter-item expanded "><a href="syntax.html"><strong aria-hidden="true">1.3.</strong> 语法</a></li><li class="chapter-item expanded "><a href="settings.html"><strong aria-hidden="true">1.4.</strong> 设置</a></li><li class="chapter-item expanded "><a href="faq.html"><strong aria-hidden="true">1.5.</strong> 常见问题</a></li></ol></li><li class="chapter-item expanded "><a href="internal-functions/overview.html"><strong aria-hidden="true">2.</strong> 内置函数</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="internal-functions/internal-modules/app-module.html"><strong aria-hidden="true">2.1.</strong> tp.app</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/config-module.html"><strong aria-hidden="true">2.2.</strong> tp.config</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/date-module.html"><strong aria-hidden="true">2.3.</strong> tp.date</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/file-module.html"><strong aria-hidden="true">2.4.</strong> tp.file</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/frontmatter-module.html"><strong aria-hidden="true">2.5.</strong> tp.frontmatter</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/hooks-module.html"><strong aria-hidden="true">2.6.</strong> tp.hooks</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/obsidian-module.html"><strong aria-hidden="true">2.7.</strong> tp.obsidian</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/system-module.html"><strong aria-hidden="true">2.8.</strong> tp.system</a></li><li class="chapter-item expanded "><a href="internal-functions/internal-modules/web-module.html"><strong aria-hidden="true">2.9.</strong> tp.web</a></li><li class="chapter-item expanded "><a href="internal-functions/contribute.html"><strong aria-hidden="true">2.10.</strong> 贡献</a></li></ol></li><li class="chapter-item expanded "><a href="user-functions/overview.html"><strong aria-hidden="true">3.</strong> 用户函数</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="user-functions/script-user-functions.html"><strong aria-hidden="true">3.1.</strong> 用户脚本</a></li><li class="chapter-item expanded "><a href="user-functions/system-user-functions.html"><strong aria-hidden="true">3.2.</strong> 系统命令</a></li></ol></li><li class="chapter-item expanded "><a href="commands/overview.html"><strong aria-hidden="true">4.</strong> 命令</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="commands/dynamic-command.html"><strong aria-hidden="true">4.1.</strong> 动态命令</a></li><li class="chapter-item expanded "><a href="commands/execution-command.html"><strong aria-hidden="true">4.2.</strong> 执行命令</a></li><li class="chapter-item expanded "><a href="commands/whitespace-control.html"><strong aria-hidden="true">4.3.</strong> 空白控制</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
