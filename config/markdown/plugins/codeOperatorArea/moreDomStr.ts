export default ({
  children = "",
  width = "auto",
  tooltips = "更多",
}: { children?: string; width?: string; tooltips?: string } = {}) => {
  return `
    <div class='more' style='--vp-code-block-coa-more-extension-width:${width}'>
        <div class='extension' >${children}</div>
        <span title='${tooltips}'>
          <svg t="1676257814799" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3582" width="100%" height="100%">
              <path d="M288 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="3583"></path>
              <path d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="3584"></path>
              <path d="M736 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="3585"></path>
          </svg>
        </span>
    </div>
    `;
};
