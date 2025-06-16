// Advanced Notification System
class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        if (document.getElementById('notification-container')) return;
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none';
        container.style.maxWidth = '400px';
        
        document.body.appendChild(container);
        this.container = container;
    }

    setupStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-enter {
                animation: slideInRight 0.3s ease-out forwards;
            }
            
            .notification-exit {
                animation: slideOutRight 0.3s ease-in forwards;
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                transition: width linear;
            }
        `;
        
        document.head.appendChild(styles);
    }

    show(message, type = 'info', options = {}) {
        const id = Date.now() + Math.random();
        const {
            duration = 5000,
            persistent = false,
            actions = [],
            title = null,
            icon = null
        } = options;

        // Remove oldest notification if at max capacity
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = Array.from(this.notifications.keys())[0];
            this.hide(oldestId);
        }

        const notification = this.createNotification(id, message, type, {
            duration,
            persistent,
            actions,
            title,
            icon
        });

        this.container.appendChild(notification);
        this.notifications.set(id, { element: notification, type, persistent });

        // Trigger enter animation
        requestAnimationFrame(() => {
            notification.classList.add('notification-enter');
        });

        // Auto-hide if not persistent
        if (!persistent && duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }

        return id;
    }

    createNotification(id, message, type, options) {
        const { duration, persistent, actions, title, icon } = options;
        
        const typeIcons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const typeClasses = {
            success: 'alert-success',
            error: 'alert-error',
            warning: 'alert-warning',
            info: 'alert-info'
        };

        const notification = document.createElement('div');
        notification.className = `alert ${typeClasses[type] || typeClasses.info} shadow-lg pointer-events-auto relative overflow-hidden`;
        notification.setAttribute('data-notification-id', id);

        const iconName = icon || typeIcons[type] || typeIcons.info;
        
        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = `
                <div class="flex gap-2 mt-2">
                    ${actions.map(action => `
                        <button class="btn btn-sm ${action.style || 'btn-ghost'}" 
                                onclick="window.notificationManager.handleAction('${id}', '${action.id}', ${action.callback})">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        notification.innerHTML = `
            <div class="flex items-start gap-3 w-full">
                <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
                <div class="flex-grow min-w-0">
                    ${title ? `<div class="font-semibold">${title}</div>` : ''}
                    <div class="text-sm ${title ? 'opacity-90' : ''}">${message}</div>
                    ${actionsHTML}
                </div>
                ${!persistent ? `
                    <button class="btn btn-ghost btn-xs btn-circle" onclick="window.notificationManager.hide('${id}')">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                ` : ''}
            </div>
            ${!persistent && duration > 0 ? `
                <div class="notification-progress" style="width: 100%; transition-duration: ${duration}ms;"></div>
            ` : ''}
        `;

        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons(notification);
        }

        // Start progress animation
        if (!persistent && duration > 0) {
            requestAnimationFrame(() => {
                const progress = notification.querySelector('.notification-progress');
                if (progress) {
                    progress.style.width = '0%';
                }
            });
        }

        return notification;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const element = notification.element;
        element.classList.add('notification-exit');

        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
            this.notifications.delete(id);
        }, 300);
    }

    hideAll() {
        for (const id of this.notifications.keys()) {
            this.hide(id);
        }
    }

    handleAction(notificationId, actionId, callback) {
        if (typeof callback === 'function') {
            callback(notificationId, actionId);
        }
        this.hide(notificationId);
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    // Special notification types
    loading(message, options = {}) {
        return this.show(message, 'info', {
            ...options,
            persistent: true,
            icon: 'loader-2',
            title: options.title || 'Loading...'
        });
    }

    confirm(message, options = {}) {
        const { onConfirm, onCancel, ...otherOptions } = options;
        
        return this.show(message, 'warning', {
            ...otherOptions,
            persistent: true,
            title: options.title || 'Confirm Action',
            actions: [
                {
                    id: 'cancel',
                    label: 'Cancel',
                    style: 'btn-ghost',
                    callback: onCancel
                },
                {
                    id: 'confirm',
                    label: 'Confirm',
                    style: 'btn-primary',
                    callback: onConfirm
                }
            ]
        });
    }

    achievement(message, options = {}) {
        return this.show(message, 'success', {
            ...options,
            duration: 8000,
            title: options.title || '🎉 Achievement Unlocked!',
            icon: 'star'
        });
    }
}

// Initialize global notification manager
const notificationManager = new NotificationManager();

// Export for global use
window.notificationManager = notificationManager;

// Add some helpful global functions
window.notify = {
    success: (msg, opts) => notificationManager.success(msg, opts),
    error: (msg, opts) => notificationManager.error(msg, opts),
    warning: (msg, opts) => notificationManager.warning(msg, opts),
    info: (msg, opts) => notificationManager.info(msg, opts),
    loading: (msg, opts) => notificationManager.loading(msg, opts),
    confirm: (msg, opts) => notificationManager.confirm(msg, opts),
    achievement: (msg, opts) => notificationManager.achievement(msg, opts)
};