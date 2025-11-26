// ===== MOBILE MENU FUNCTIONALITY =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && mobileMenuToggle) {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Offset for fixed nav
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to cards
document.querySelectorAll('.tier-card, .benefit-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ===== ANIMATED STATISTICS COUNTERS =====
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }
    }, 16);
}

// Observer for statistics section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger counter animations
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(statNumber => {
                const target = parseInt(statNumber.dataset.target);
                const suffix = statNumber.dataset.suffix || '';
                animateCounter(statNumber, target, 1500, suffix);
            });

            // Unobserve after animation triggers
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

// Observe the stats section
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== BENEFITS CALCULATOR =====
const tierData = {
    explorer: {
        name: 'Explorer',
        qualification: 'Automatic',
        creditBack: 0,      // No credits
        annualCredit: 0,
        birthdayCredit: 0,
        sessionsRequired: 0  // Auto on first session
    },
    voyager: {
        name: 'Voyager',
        qualification: '10-24 sessions/year',
        creditBack: 5,      // 5% credits back
        annualCredit: 0,
        birthdayCredit: 25, // $25 birthday credit
        sessionsRequired: 10
    },
    pioneer: {
        name: 'Pioneer',
        qualification: '25-49 sessions/year',
        creditBack: 10,     // 10% credits back
        annualCredit: 100,  // $100 annual milestone
        birthdayCredit: 0,
        seasonalBonus: 25,  // $25 summer bonus
        sessionsRequired: 25
    },
    trailblazer: {
        name: 'Trailblazer',
        qualification: 'Invite Only',
        creditBack: 15,     // 15% credits back
        annualCredit: 500,  // $500 annual credit
        birthdayCredit: 0,
        sessionsRequired: null  // Invite only
    }
};

const avgCharge = 40; // $0.50/kWh * 80 kWh average session

function calculateCredits(sessions, tierKey) {
    const tier = tierData[tierKey];

    // Base credits from charging (sessions * avg charge * credit back percentage)
    const baseCredits = sessions * avgCharge * (tier.creditBack / 100);

    // Annual credits and bonuses
    const annualCredits = tier.annualCredit || 0;
    const birthdayCredit = tier.birthdayCredit || 0;
    const seasonalBonus = tier.seasonalBonus || 0;

    // Total credits earned
    const totalCredits = baseCredits + annualCredits + birthdayCredit + seasonalBonus;

    return {
        baseCredits: baseCredits,
        bonusCredits: annualCredits + birthdayCredit + seasonalBonus,
        totalCredits: totalCredits
    };
}

function getQualifiedTier(sessions) {
    // Determine which tier the user qualifies for based on session count
    if (sessions >= 25) return 'pioneer';
    if (sessions >= 10) return 'voyager';
    return 'explorer';
}

function getNextTier(currentTier) {
    const tierOrder = ['explorer', 'voyager', 'pioneer', 'trailblazer'];
    const currentIndex = tierOrder.indexOf(currentTier);
    if (currentIndex < tierOrder.length - 1) {
        return tierOrder[currentIndex + 1];
    }
    return null;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function animateValue(element, newValue) {
    element.classList.add('updating');
    setTimeout(() => {
        element.classList.remove('updating');
    }, 300);
}

function updateCalculator(sessions) {
    const resultsContainer = document.getElementById('calculator-results');

    // Determine qualified tier based on session count
    const qualifiedTier = getQualifiedTier(sessions);
    const nextTier = getNextTier(qualifiedTier);

    // Generate HTML for all tiers
    resultsContainer.innerHTML = Object.keys(tierData).map(tierKey => {
        const tier = tierData[tierKey];
        const credits = calculateCredits(sessions, tierKey);
        const isQualified = tierKey === qualifiedTier;
        const isNextGoal = tierKey === nextTier;

        // Determine status badge
        let statusBadge = '';
        if (isQualified) {
            statusBadge = '<div class="calc-status-badge qualified">YOUR STATUS</div>';
        } else if (isNextGoal) {
            statusBadge = '<div class="calc-status-badge next-goal">NEXT GOAL</div>';
        }

        // Calculate sessions needed to reach this tier
        let qualificationText = tier.qualification;
        if (!isQualified && tier.sessionsRequired !== null && sessions < tier.sessionsRequired) {
            const sessionsNeeded = tier.sessionsRequired - sessions;
            qualificationText += ` • ${sessionsNeeded} more session${sessionsNeeded !== 1 ? 's' : ''} to qualify`;
        }

        // Build credit breakdown text
        let creditBreakdown = '';
        if (tier.creditBack > 0) {
            creditBreakdown += `${tier.creditBack}% back on charging`;
        }
        if (tier.annualCredit > 0) {
            creditBreakdown += (creditBreakdown ? ' + ' : '') + `$${tier.annualCredit} annual credit`;
        }
        if (tier.birthdayCredit > 0) {
            creditBreakdown += (creditBreakdown ? ' + ' : '') + `$${tier.birthdayCredit} birthday credit`;
        }
        if (tier.seasonalBonus > 0) {
            creditBreakdown += (creditBreakdown ? ' + ' : '') + `$${tier.seasonalBonus} seasonal bonus`;
        }
        if (!creditBreakdown) {
            creditBreakdown = 'No credits earned';
        }

        return `
            <div class="calc-result-card ${isQualified ? 'recommended' : ''} ${isNextGoal ? 'next-tier' : ''}">
                ${statusBadge}
                <div class="calc-tier-name">${tier.name}</div>
                <div class="calc-tier-qualification">${qualificationText}</div>
                <div class="calc-metric">
                    <div class="calc-metric-label">Credits Earned</div>
                    <div class="calc-metric-value">${formatMoney(credits.totalCredits)}</div>
                </div>
                <div class="calc-credit-breakdown">${creditBreakdown}</div>
            </div>
        `;
    }).join('');

    // Animate all values
    document.querySelectorAll('.calc-metric-value').forEach(el => {
        animateValue(el);
    });
}

// Initialize calculator
const slider = document.getElementById('charging-sessions');
const sessionCountDisplay = document.getElementById('session-count');

if (slider && sessionCountDisplay) {
    slider.addEventListener('input', (e) => {
        const sessions = parseInt(e.target.value);
        sessionCountDisplay.textContent = sessions;
        updateCalculator(sessions);
    });

    // Initialize with default value
    updateCalculator(parseInt(slider.value));
}

// ===== TIER VIEW TOGGLE =====
const toggleButtons = document.querySelectorAll('.view-toggle-btn');
const tiersGrid = document.querySelector('.tiers-grid');
const tiersTable = document.querySelector('.tiers-table');

toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const view = button.dataset.view;

        // Update button states
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Switch views with fade transition
        if (view === 'grid') {
            tiersTable.classList.add('fade-out');
            setTimeout(() => {
                tiersTable.style.display = 'none';
                tiersGrid.style.display = 'grid';
                tiersGrid.classList.remove('fade-out');
            }, 300);
        } else {
            tiersGrid.classList.add('fade-out');
            setTimeout(() => {
                tiersGrid.style.display = 'none';
                tiersTable.style.display = 'block';
                tiersTable.classList.remove('fade-out');
            }, 300);
        }
    });
});
