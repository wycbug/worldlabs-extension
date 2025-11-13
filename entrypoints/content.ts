import './style.css';

export default defineContentScript({
  matches: ['*://marble.worldlabs.ai/*'],
  cssInjectionMode: 'manifest',
  main(ctx) {
    console.log('Marble WorldLabs extension loaded');
    
    // Helper function to get localized message
    const t = (key: string, substitutions?: string[]) => {
      return (browser.i18n as any).getMessage(key, substitutions);
    };

    // Extract world ID from URL
    const extractWorldId = () => {
      const url = window.location.href;
      const match = url.match(/\/world\/([a-f0-9-]{36})/);
      return match ? match[1] : null;
    };

    // Extract world ID from a specific URL
    const extractWorldIdFromUrl = (url: string) => {
      const match = url.match(/\/world\/([a-f0-9-]{36})/);
      return match ? match[1] : null;
    };

    // Store current world ID to track changes
    let currentWorldId: string | null = null;

    // Create sidebar
    const createSidebar = () => {
      // Remove existing sidebar if present
      const existingSidebar = document.getElementById('marble-extension-sidebar');
      if (existingSidebar) {
        existingSidebar.remove();
      }

      const sidebar = document.createElement('div');
      sidebar.id = 'marble-extension-sidebar';
      sidebar.className = 'marble-extension-sidebar';

      const header = document.createElement('div');
      header.className = 'marble-extension-header';
      header.innerHTML = `
        <h3 class="marble-extension-title">${t('worldDetails')}</h3>
        <button id="close-sidebar" class="marble-extension-close">✕</button>
      `;

      const content = document.createElement('div');
      content.id = 'sidebar-content';
      content.className = 'marble-extension-content';
      content.innerHTML = `<p class="marble-extension-text-body">${t('loadingWorldData')}</p>`;

      sidebar.appendChild(header);
      sidebar.appendChild(content);
      document.body.appendChild(sidebar);

      // Close button functionality
      document.getElementById('close-sidebar')?.addEventListener('click', () => {
        sidebar.remove();
      });
    };

    // Fetch world data
    const fetchWorldData = async (worldId: string) => {
      try {
        // Check if extension context is still valid before making request
        if (ctx.isInvalid) {
          console.log('Extension context invalidated, aborting fetch');
          return;
        }
        
        const response = await fetch(`https://marble2-kgw-prod-iac1.wlt-ai.art/api/v1/worlds/${worldId}`);
        
        // Check context again after async operation
        if (ctx.isInvalid) {
          console.log('Extension context invalidated after fetch, aborting');
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch world data');
        
        const data = await response.json();
        
        // Final context check before updating UI
        if (ctx.isInvalid) {
          console.log('Extension context invalidated before UI update, aborting');
          return;
        }
        
        displayWorldData(data);
      } catch (error) {
        console.error('Error fetching world data:', error);
        
        // Only update UI if context is still valid
        if (!ctx.isInvalid) {
          const content = document.getElementById('sidebar-content');
          if (content) {
            content.innerHTML = `<p style="color: red;">${t('failedToLoadWorldData')}</p>`;
          }
        }
      }
    };

    // Display world data
    const displayWorldData = (data: any) => {
      const content = document.getElementById('sidebar-content');
      if (!content) return;

      const { display_name, generation_input, generation_output, stats, application_data } = data;
      
      content.innerHTML = `
        <div class="marble-extension-space-y-6">
          <div>
            <h4 class="marble-extension-text-title">${display_name}</h4>
            <p class="marble-extension-text-body">${t('by', [application_data?.owner_display_name || t('unknown')])}</p>
          </div>

          <div>
            <h5 class="marble-extension-text-subtitle">${t('stats')}</h5>
            <div class="marble-extension-stats">
              <span style="color: #ef4444;">❤️</span>
              <span>${t('likes', [String(stats?.like_count || 0)])}</span>
            </div>
          </div>

          <div>
            <h5 class="marble-extension-text-subtitle">${t('prompt')}</h5>
            <div class="marble-extension-prompt-box">
              ${generation_input?.prompt?.text_prompt || 'No prompt available'}
            </div>
            <button id="copy-prompt" class="marble-extension-btn marble-extension-btn-primary" style="margin-top: 8px;">
              ${t('copyPrompt')}
            </button>
          </div>

          ${generation_input?.prompt?.image_prompt?.uri ? `
          <div>
            <h5 class="marble-extension-text-subtitle">${t('inputImage')}</h5>
            <img src="${generation_input.prompt.image_prompt.uri}" class="marble-extension-image" alt="Input image" />
            <button id="download-input" class="marble-extension-btn marble-extension-btn-success">
              ${t('downloadImage')}
            </button>
          </div>
          ` : ''}

          <div>
            <h5 class="marble-extension-text-subtitle">${t('model')}</h5>
            <p class="marble-extension-model-badge">${generation_input?.model || t('unknown')}</p>
          </div>

          ${generation_output?.spz_urls ? `
          <div>
            <h5 class="marble-extension-text-subtitle">${t('exportFiles')}</h5>
            <div class="marble-extension-space-y-2">
              ${Object.entries(generation_output.spz_urls).map(([quality, url]) => `
                <a href="${url}" download class="marble-extension-btn marble-extension-btn-purple">
                  ${t('downloadQuality', [quality.charAt(0).toUpperCase() + quality.slice(1)])}
                </a>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      `;

      // Add event listeners
      document.getElementById('copy-prompt')?.addEventListener('click', () => {
        navigator.clipboard.writeText(generation_input?.prompt?.text_prompt || '');
        const button = document.getElementById('copy-prompt');
        if (button) {
          button.textContent = t('copied');
          setTimeout(() => {
            button.textContent = t('copyPrompt');
          }, 2000);
        }
      });

      document.getElementById('download-input')?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = generation_input?.prompt?.image_prompt?.uri || '';
        link.download = 'input-image.png';
        link.click();
      });
    };

    // Initialize or update extension based on current URL
    const initializeOrUpdateExtension = () => {
      // Check if extension context is still valid
      if (ctx.isInvalid) {
        console.log('Extension context invalidated, skipping initialization');
        return;
      }
      
      const worldId = extractWorldId();
      
      if (worldId && worldId !== currentWorldId) {
        currentWorldId = worldId;
        
        // Remove existing floating button if present
        const existingButton = document.getElementById('marble-extension-button');
        if (existingButton) {
          existingButton.remove();
        }
        
        // Add floating button to open sidebar
        const floatingButton = document.createElement('button');
        floatingButton.id = 'marble-extension-button';
        floatingButton.className = 'marble-extension-float-btn';
        floatingButton.innerHTML = '📋';
        floatingButton.title = t('showWorldDetails');
        
        floatingButton.addEventListener('click', () => {
          // Double-check context before opening sidebar
          if (!ctx.isInvalid) {
            createSidebar();
            fetchWorldData(worldId);
          }
        });
        
        document.body.appendChild(floatingButton);
        
        // If sidebar is already open, update its content with new world data
        const existingSidebar = document.getElementById('marble-extension-sidebar');
        if (existingSidebar) {
          console.log('Sidebar is open, updating content for new world:', worldId);
          // Show loading state in existing sidebar
          const sidebarContent = document.getElementById('sidebar-content');
          if (sidebarContent) {
            sidebarContent.innerHTML = `<p class="marble-extension-text-body">${t('loadingWorldData')}</p>`;
          }
          // Fetch new data for the current world
          fetchWorldData(worldId);
        }
      } else if (!worldId && currentWorldId) {
        // We're no longer on a world page, remove the button and sidebar
        const existingButton = document.getElementById('marble-extension-button');
        if (existingButton) {
          existingButton.remove();
        }
        
        const existingSidebar = document.getElementById('marble-extension-sidebar');
        if (existingSidebar) {
          existingSidebar.remove();
        }
        
        currentWorldId = null;
      }
    };

    // Listen for SPA navigation changes
    ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
      console.log('URL changed to:', newUrl);
      initializeOrUpdateExtension();
    });

    // Also listen for popstate events (browser back/forward)
    ctx.addEventListener(window, 'popstate', () => {
      console.log('Popstate event detected');
      initializeOrUpdateExtension();
    });

    // Additional fallback: Monitor URL changes with setInterval for aggressive SPA detection
    let lastUrl = window.location.href;
    const urlCheckInterval = ctx.setInterval(() => {
      // Check if extension context is still valid
      if (ctx.isInvalid) {
        clearInterval(urlCheckInterval);
        return;
      }
      
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        console.log('URL change detected via polling:', currentUrl);
        lastUrl = currentUrl;
        initializeOrUpdateExtension();
      }
    }, 1000); // Check every second

    // Initial initialization
    initializeOrUpdateExtension();
  },
});
