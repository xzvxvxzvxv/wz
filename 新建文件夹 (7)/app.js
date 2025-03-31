// 页面加载动画
window.addEventListener('load', function() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// 响应式导航菜单
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // 返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // 投资卡片展开功能
    const investCards = document.querySelectorAll('.job[data-position]');
    investCards.forEach(card => {
        const details = card.querySelector('ul');
        const btn = card.querySelector('.invest-btn');
        
        // 初始状态
        details.style.maxHeight = '0';
        details.style.overflow = 'hidden';
        details.style.transition = 'max-height 0.3s ease';
        
        // 点击卡片切换详情
        card.addEventListener('click', function(e) {
            if (e.target !== btn) {
                const isExpanded = details.style.maxHeight !== '0px';
                details.style.maxHeight = isExpanded ? '0' : `${details.scrollHeight}px`;
                card.classList.toggle('expanded');
            }
        });

        // 按钮悬停效果
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // 表单验证
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = '此字段为必填项';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // 工作人员管理功能
    if (document.querySelector('.staff-container')) {
        // 初始化数据存储
        if (!localStorage.getItem('applicants')) {
            const defaultApplicants = [
                {
                    id: 1001,
                    name: '张三',
                    phone: '13800138000',
                    position: '门店经理',
                    date: '2023-05-15',
                    status: 'pending',
                    experience: '3年相关经验',
                    bio: '有丰富的门店管理经验，擅长团队建设'
                },
                {
                    id: 1002,
                    name: '李四',
                    phone: '13900139000',
                    position: '厨师',
                    date: '2023-05-16',
                    status: 'approved',
                    experience: '5年管理经验',
                    bio: '精通各类汉堡制作工艺，获得过厨艺比赛奖项'
                },
                {
                    id: 1003,
                    name: '王五',
                    phone: '13700137000',
                    position: '服务员',
                    date: '2023-05-17',
                    status: 'rejected',
                    experience: '2年服务经验',
                    bio: '服务意识强，曾获月度优秀员工称号'
                }
            ];
            localStorage.setItem('applicants', JSON.stringify(defaultApplicants));
        }

        // 分页设置
        const itemsPerPage = 5;
        let currentPage = 1;

        // 渲染表格数据
        const renderTable = (applicants) => {
            const tbody = document.querySelector('.applicant-table tbody');
            tbody.innerHTML = '';
            
            applicants.forEach(applicant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${applicant.id}</td>
                    <td>${applicant.name}</td>
                    <td>${applicant.position}</td>
                    <td>${applicant.date}</td>
                    <td><span class="status-${applicant.status}">${
                        applicant.status === 'pending' ? '待审核' : 
                        applicant.status === 'approved' ? '已通过' : '已拒绝'
                    }</span></td>
                    <td><button class="view-details-btn">查看详情</button></td>
                `;
                tbody.appendChild(row);
            });
        };

        // 分页功能
        const updatePagination = (totalItems) => {
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const pagination = document.querySelector('.pagination');
            pagination.innerHTML = '';
            
            if (currentPage > 1) {
                pagination.innerHTML += '<button class="page-btn prev-btn">上一页</button>';
            }
            
            for (let i = 1; i <= totalPages; i++) {
                pagination.innerHTML += `
                    <button class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>
                `;
            }
            
            if (currentPage < totalPages) {
                pagination.innerHTML += '<button class="page-btn next-btn">下一页</button>';
            }
            
            // 添加分页按钮事件
            document.querySelectorAll('.page-btn').forEach(btn => {
                if (btn.textContent === '上一页') {
                    btn.addEventListener('click', () => {
                        currentPage--;
                        loadApplicants();
                    });
                } else if (btn.textContent === '下一页') {
                    btn.addEventListener('click', () => {
                        currentPage++;
                        loadApplicants();
                    });
                } else if (!isNaN(btn.textContent)) {
                    btn.addEventListener('click', () => {
                        currentPage = parseInt(btn.textContent);
                        loadApplicants();
                    });
                }
            });
        };

        // 加载申请数据
        const loadApplicants = () => {
            let applicants = JSON.parse(localStorage.getItem('applicants'));
            
            // 应用搜索和筛选
            const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
            const filterStatus = document.querySelector('.filter-options select').value;
            
            applicants = applicants.filter(applicant => {
                const matchesSearch = applicant.name.toLowerCase().includes(searchTerm) || 
                                     applicant.position.toLowerCase().includes(searchTerm);
                const matchesFilter = filterStatus === 'all' || applicant.status === filterStatus;
                return matchesSearch && matchesFilter;
            });
            
            // 分页处理
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedApplicants = applicants.slice(startIndex, startIndex + itemsPerPage);
            
            renderTable(paginatedApplicants);
            updatePagination(applicants.length);
        };

        // 初始化加载
        loadApplicants();

        // 查看详情功能
        const detailModal = document.getElementById('detail-modal');
        const closeModal = document.querySelector('.close-modal');
        let currentApplicantId = null;

        // 委托事件处理
        document.querySelector('.applicant-table').addEventListener('click', function(e) {
            if (e.target.classList.contains('view-details-btn')) {
                const row = e.target.closest('tr');
                const id = parseInt(row.cells[0].textContent);
                const applicants = JSON.parse(localStorage.getItem('applicants'));
                const applicant = applicants.find(a => a.id === id);
                
                if (applicant) {
                    currentApplicantId = id;
                    document.getElementById('detail-name').textContent = applicant.name;
                    document.getElementById('detail-phone').textContent = applicant.phone;
                    document.getElementById('detail-position').textContent = applicant.position;
                    document.getElementById('detail-date').textContent = applicant.date;
                    document.getElementById('detail-experience').textContent = applicant.experience;
                    document.getElementById('detail-bio').textContent = applicant.bio;
                    
                    detailModal.style.display = 'flex';
                }
            }
        });

        closeModal.addEventListener('click', function() {
            detailModal.style.display = 'none';
        });

        // 搜索和筛选功能
        document.querySelector('.search-btn').addEventListener('click', loadApplicants);
        document.querySelector('.search-box input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadApplicants();
        });
        document.querySelector('.filter-options select').addEventListener('change', loadApplicants);

        // 通过/拒绝功能
        document.querySelector('.approve-btn')?.addEventListener('click', function() {
            if (currentApplicantId) {
                const applicants = JSON.parse(localStorage.getItem('applicants'));
                const index = applicants.findIndex(a => a.id === currentApplicantId);
                if (index !== -1) {
                    applicants[index].status = 'approved';
                    localStorage.setItem('applicants', JSON.stringify(applicants));
                    loadApplicants();
                    alert('已通过该申请');
                }
            }
            detailModal.style.display = 'none';
        });

        document.querySelector('.reject-btn')?.addEventListener('click', function() {
            if (currentApplicantId) {
                const applicants = JSON.parse(localStorage.getItem('applicants'));
                const index = applicants.findIndex(a => a.id === currentApplicantId);
                if (index !== -1) {
                    applicants[index].status = 'rejected';
                    localStorage.setItem('applicants', JSON.stringify(applicants));
                    loadApplicants();
                    alert('已拒绝该申请');
                }
            }
            detailModal.style.display = 'none';
        });
    }
});
