class MoneyEarningApp {
    constructor() {
        this.totalEarned = 0; // Current Balance to collect
        this.accumulatedTotal = 0; // Total Accumulated (never decreases)
        this.totalCoinsCollected = 0; // Total coins collected (never decreases)
        this.annualIncome = 315360; // $315,360 per year (default: $0.01 per second)
        this.earningRate = this.annualIncome / (365 * 24 * 60 * 60); // convert to per second
        this.lastUpdate = Date.now();
        this.lastCollectTime = 0; // Track last collection time
        this.isRunning = true;
        
        this.initializeElements();
        this.bindEvents();
        this.startEarning();
    }

    initializeElements() {
        this.totalEarnedElement = document.getElementById('total-earned');
        this.accumulatedTotalElement = document.getElementById('accumulated-total');
        this.totalCoinsElement = document.getElementById('total-coins');
        this.perSecondElement = document.getElementById('per-second');
        this.perMinuteElement = document.getElementById('per-minute');
        this.collectBtn = document.getElementById('collect-btn');
        this.rateInput = document.getElementById('rate-input');
        this.updateRateBtn = document.getElementById('update-rate');
        this.toggleRateBtn = document.getElementById('toggle-rate');
        this.rateControls = document.querySelector('.rate-controls');

    }

    bindEvents() {
        this.collectBtn.addEventListener('click', () => this.collectCoins());
        this.updateRateBtn.addEventListener('click', () => this.updateEarningRate());
        this.toggleRateBtn.addEventListener('click', () => this.toggleRateVisibility());
        this.rateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.updateEarningRate();
        });
    }

    startEarning() {
        const updateEarnings = () => {
            if (!this.isRunning) return;

            const now = Date.now();
            const deltaTime = (now - this.lastUpdate) / 1000; // convert to seconds
            this.lastUpdate = now;

            // Add earned money based on time passed
            const earned = this.earningRate * deltaTime;
            this.totalEarned += earned; // Current Balance to collect
            // Note: accumulatedTotal only increases when collecting coins, not automatically
            
            this.updateDisplay();
            
            requestAnimationFrame(updateEarnings);
        };

        updateEarnings();
    }

    updateDisplay() {
        // Store previous values for comparison
        const previousTotal = parseFloat(this.totalEarnedElement.textContent.replace(/[$,]/g, '')) || 0;
        const previousAccumulated = parseFloat(this.accumulatedTotalElement.textContent.replace(/[$,]/g, '')) || 0;
        
        // Update display values
        this.totalEarnedElement.textContent = this.formatMoney(this.totalEarned);
        this.accumulatedTotalElement.textContent = this.formatMoney(this.accumulatedTotal);
        this.totalCoinsElement.textContent = this.totalCoinsCollected.toLocaleString();
        this.perSecondElement.textContent = this.formatMoney(this.earningRate);
        this.perMinuteElement.textContent = this.formatMoney(this.earningRate * 60);
        
        // Add exciting animations when money increases
        if (this.totalEarned > previousTotal) {
            this.animateMoneyIncrease(this.totalEarnedElement, this.totalEarned - previousTotal);
        }
        
        if (this.accumulatedTotal > previousAccumulated) {
            this.animateMoneyIncrease(this.accumulatedTotalElement, this.accumulatedTotal - previousAccumulated);
        }
    }

    collectCoins() {
        // Prevent rapid clicking by checking if enough time has passed
        const now = Date.now();
        if (now - this.lastCollectTime < 100) { // Minimum 100ms between clicks
            return;
        }
        this.lastCollectTime = now;
        
        // Check if there's at least $0.01 to collect
        if (this.totalEarned < 0.01) {
            // Show insufficient balance notification
            this.showInsufficientBalanceNotification();
            return;
        }
        
        // Collect ALL available balance
        const totalBonus = this.totalEarned;
        
        // Calculate coin count based on the amount collected (for visual effect)
        const coinCount = Math.max(3, Math.min(7, Math.floor(totalBonus / (this.earningRate * 5)) + 3));
        
        // Deduct collected amount from Current Balance to collect
        this.totalEarned = 0; // Set to 0 since we're collecting everything
        
        // Add collected amount to Total Accumulated
        this.accumulatedTotal += totalBonus;
        
        // Add coins to total coins collected
        this.totalCoinsCollected += coinCount;
        
        // Simple collection without celebration animation
        
        // No coin animation - simple collection

        // Update display immediately
        this.updateDisplay();
        
        // Add visual feedback to the collect button
        this.collectBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.collectBtn.style.transform = '';
        }, 150);
        
        // Show bonus amount notification
        this.showBonusNotification(totalBonus, coinCount);
    }



    updateEarningRate() {
        const newAnnualIncome = parseFloat(this.rateInput.value);
        if (newAnnualIncome >= 0 && !isNaN(newAnnualIncome)) {
            this.annualIncome = newAnnualIncome;
            this.earningRate = this.annualIncome / (365 * 24 * 60 * 60); // convert to per second
            this.rateInput.style.borderColor = '#4CAF50';
            
            // Visual feedback
            setTimeout(() => {
                this.rateInput.style.borderColor = '#e1e5e9';
            }, 1000);
            
            this.updateDisplay();
        } else {
            this.rateInput.style.borderColor = '#f44336';
            setTimeout(() => {
                this.rateInput.style.borderColor = '#e1e5e9';
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
    }

    resume() {
        this.isRunning = true;
        this.lastUpdate = Date.now();
        this.startEarning();
    }
    
    toggleRateVisibility() {
        const isHidden = this.rateControls.classList.contains('hidden');
        
        if (isHidden) {
            // Show the rate controls
            this.rateControls.classList.remove('hidden');
            this.toggleRateBtn.textContent = 'Hide Rate';
            this.toggleRateBtn.classList.remove('hidden');
        } else {
            // Hide the rate controls
            this.rateControls.classList.add('hidden');
            this.toggleRateBtn.textContent = 'Show Rate';
            this.toggleRateBtn.classList.add('hidden');
        }
    }
    
    showBonusNotification(bonus, coinCount) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(79, 172, 254, 0.95) 0%, rgba(0, 242, 254, 0.95) 100%);
            backdrop-filter: blur(20px);
            color: white;
            padding: 2rem 2.5rem;
            border-radius: 24px;
            font-size: 1.25rem;
            font-weight: 700;
            z-index: 1002;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
            text-align: center;
            animation: bonusPopup 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 320px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 800;">Collected</div>
            <div style="font-size: 2rem; margin-bottom: 1rem; font-family: 'SF Mono', monospace; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${this.formatMoney(bonus)}</div>
            <div style="font-size: 1rem; opacity: 0.9; margin-top: 0.5rem; line-height: 1.4;">
                ${coinCount} collections this round<br>
                <strong>Total: ${this.totalCoinsCollected.toLocaleString()} collections</strong>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'bonusPopupOut 0.5s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
    
    showInsufficientBalanceNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.95) 0%, rgba(255, 82, 82, 0.95) 100%);
            backdrop-filter: blur(20px);
            color: white;
            padding: 2rem 2.5rem;
            border-radius: 24px;
            font-size: 1.25rem;
            font-weight: 700;
            z-index: 1002;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
            text-align: center;
            animation: bonusPopup 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 320px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 800;">Insufficient Balance</div>
            <div style="font-size: 1rem; opacity: 0.9; margin-top: 0.5rem; line-height: 1.4;">
                Minimum $0.01 required to collect coins<br>
                <strong>Current: ${this.formatMoney(this.totalEarned)}</strong>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 2.5 seconds
        setTimeout(() => {
            notification.style.animation = 'bonusPopupOut 0.5s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 2500);
    }
    
    animateMoneyIncrease(element, increaseAmount) {
        // Simple subtle animation without particles
        element.style.animation = 'professionalMoneyScale 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Add subtle professional glow
        element.style.textShadow = '0 0 15px rgba(79, 172, 254, 0.4), 0 0 30px rgba(79, 172, 254, 0.2)';
        
        // Add professional number transition
        this.animateProfessionalNumberTransition(element, increaseAmount);
        
        // Reset glow effect after animation
        setTimeout(() => {
            element.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }, 800);
        
        // Reset animation
        setTimeout(() => {
            element.style.animation = '';
        }, 800);
    }
    
    animateProfessionalNumberTransition(element, increaseAmount) {
        // Create a professional increase indicator
        const increaseElement = document.createElement('div');
        increaseElement.textContent = `+${this.formatMoney(increaseAmount)}`;
        increaseElement.style.cssText = `
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            color: #4facfe;
            font-size: 1rem;
            font-weight: 600;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            animation: professionalNumberFade 2s ease-out forwards;
            pointer-events: none;
            z-index: 1002;
            opacity: 0;
        `;
        
        // Make parent element relative for positioning
        element.style.position = 'relative';
        element.appendChild(increaseElement);
        
        // Remove the increase element after animation
        setTimeout(() => {
            if (increaseElement.parentNode) {
                increaseElement.parentNode.removeChild(increaseElement);
            }
        }, 2000);
    }
    

    

    

    
    formatMoney(amount) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(2)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(2)}K`;
        } else {
            return `$${amount.toFixed(2)}`;
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new MoneyEarningApp();
    
    // Add some fun features
    let clickCount = 0;
    const clickThreshold = 10;
    
    app.collectBtn.addEventListener('click', () => {
        clickCount++;
        
        // Special effect after multiple rapid clicks
        if (clickCount >= clickCount) {
            app.collectBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)';
            setTimeout(() => {
                app.collectBtn.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            }, 500);
        }
        
        // Reset click count after a delay
        setTimeout(() => {
            clickCount = 0;
        }, 2000);
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            app.collectCoins();
        } else if (e.code === 'KeyR') {
            e.preventDefault();
            app.updateEarningRate();
        }
    });
    
    // No initial animations - clean interface
    
    // Add professional tooltip for keyboard shortcuts
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 16px;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 1001;
        pointer-events: none;
        opacity: 0.9;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    tooltip.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">⌨️</span>
            <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Shortcuts</div>
                <div style="font-size: 0.75rem; opacity: 0.8;">
                    <strong>Space:</strong> Collect | <strong>R:</strong> Update
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(tooltip);
    
    // Hide tooltip after 6 seconds with smooth animation
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(20px)';
        setTimeout(() => tooltip.remove(), 500);
    }, 6000);
});

// Add some fun easter eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Konami code activated!
        document.body.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)';
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 3000);
        
        // Reset code
        konamiCode = [];
    }
});
