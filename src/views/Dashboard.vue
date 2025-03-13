<script setup lang="ts">
/*import {
  CalendarDateRangeIcon,
  ArrowDownCircleIcon,
  ArrowPathRoundedSquareIcon,
  ListBulletIcon
} from '@heroicons/vue/24/solid';*/

</script>

<template>
  <main class="dashboard-container">
    <div class="font-med text-[18px] text-white tracking-tighter">Dashboard</div>
    <div class="dashboard-1">
      <total-earning-widget/>
      <number-sales-widget/>
      <total-products-widget/>
      <!--<div class="stats bg-[#744e4e] shadow-md flex-auto">
        <div class="stat">
          <div class="stat-figure text-[#fff0ed]">
            <arrow-down-circle-icon class="h-6" />
          </div>
          <div class="stat-title text-[#e3dddc]">Low Stock</div>
          <div class="stat-value text-white text-[24px]">12</div>
          <div class="stat-desc text-[#f5310f]">↘︎ 90 (14%)</div>
        </div>
      </div>-->
      <total-customers-widget/>
    </div>
    <div class="dashboard-2">
      <sales-trends-widget/>
    </div>
    <!--
    <div class="dashboard-3">
      <div class="dashboard-3-1 widget shadow-md">
        <div class="dashboard-wHead">
          <div>
            Inventory & Stock
          </div>
          <div class="flex">
            <div class="d-button bg-transparent mr-2 tooltip" data-tip="Refresh">
              <arrow-path-rounded-square-icon class="icon" />
            </div>
            <div class="dropdown dropdown-end tooltip" data-tip="Sort By">
              <div tabindex="0" role="button" class="d-button bg-transparent">
                <list-bullet-icon class="icon" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-30 shadow-lg">
                <li><a>Name</a></li>
                <li><a>Remaining Stocks</a></li>
                <li><a>Expiring Products</a></li>
              </ul>
            </div>
          </div>
        </div>
        <table class="table d-table">
          <thead>
            <tr>
              <td>Product</td>
              <td>Stocks</td>
              <td>Expiry Date</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bear Brand 10x250mg</td>
              <td>
                <div class="d-tooltip-item">1
                  <div class="d-tooltip">Test</div>
                </div>
              </td>
              <td>
                <div class="d-tooltip-item">1
                  <div class="d-tooltip">Test</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Bear Brand 10x250mg</td>
              <td>
                <div class="d-tooltip-item">1
                  <div class="d-tooltip">Test</div>
                </div>
              </td>
              <td>
                <div class="d-tooltip-item">1
                  <div class="d-tooltip">Test</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="dashboard-3-2 widget shadow-md">
        <div class="dashboard-wHead">
          <div>
            Recent Orders
          </div>
          <div class="flex">
            <div class="d-button bg-transparent mr-2 tooltip" data-tip="Refresh">
              <arrow-path-rounded-square-icon class="icon" />
            </div>
            <div class="dropdown dropdown-end mr-2 tooltip" data-tip="Range">
              <div tabindex="0" role="button" class="d-button bg-transparent">
                <calendar-date-range-icon class="icon" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-30 shadow-lg">
                <li><a>Week ago</a></li>
                <li><a>Month ago</a></li>
                <li><a>6 Months ago</a></li>
                <li><a>Year ago</a></li>
                <li><a>All</a></li>
              </ul>
            </div>
            <div class="dropdown dropdown-end tooltip" data-tip="Sort By">
              <div tabindex="0" role="button" class="d-button bg-transparent">
                <list-bullet-icon class="icon" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-30 shadow-lg">
                <li><a>Order ID</a></li>
                <li><a>Transaction Date</a></li>
                <li><a>Total Amount</a></li>
              </ul>
            </div>
          </div>
        </div>
        <table class="table d-table">
          <thead>
            <tr>
              <td>Order #</td>
              <td>Customer</td>
              <td>Products</td>
              <td>Transaction Date</td>
              <td>Total Amount</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123</td>
              <td>Michael Jackson</td>
              <td>
                <div class="d-tooltip-item">100 Products
                  <div class="d-tooltip">Test</div>
                </div>
              </td>
              <td>July 19, 2022</td>
              <td>PHP 100,000.00</td>
            </tr>
            <tr>
              <td>123</td>
              <td>Michael Jackson</td>
              <td>
                <div class="d-tooltip-item">
                  100 Products
                  <div class="d-tooltip">Test</div>
                </div>
              </td>
              <td>July 19, 2022</td>
              <td>PHP 100,000.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>-->
  </main>
</template>

<style scoped>
.d-tooltip-item {
  height: max-content;
  position: relative;
  flex-direction: column;
  width: min-content;
}

.d-tooltip-item .d-tooltip {
  border-radius: 5px;
  margin-left: -10px;
  margin-top: 2px;
  padding: 5px;
  background-color: rgb(31, 25, 25);
  visibility: hidden;
  position: absolute;
  width: 120px;
  z-index: 1;
}

.d-tooltip-item:hover {
  text-decoration: dashed underline 1px;
  text-underline-offset: 2px;
}

.d-tooltip-item:hover .d-tooltip {
  visibility: visible;
}


.d-table {
  background-color: #5a3939;
  border-collapse: collapse;
  width: 100%;
  box-shadow: inset -12px -8px 40px #421f1f5e;
}

.d-table thead td {
  padding: 13px 14px 13px 12px;
  font-size: 14px;
  color: rgb(245, 245, 245);
  font-weight: 500;
}


.d-table tbody td {
  font-size: 15px;
  padding: 12px 0 12px 14px;
  border-top: 1px solid rgb(124, 90, 90);
  font-variation-settings:
    "wdth" 75;
}

.dashboard-container {
  display: flex;
  text-wrap: nowrap;
  flex-direction: column;
  gap: 20px;
  padding: 26px;
}

.widget {
  user-select: none;
  flex: 1 1;
  color: #FFF;
  border-radius: 13px;
  background-color: #744e4e;
  padding: 20px;
  padding-top: 12px;
  height: max-content;

}

.dashboard-container>div {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;

}

.dashboard-2-1,
.dashboard-3-1,
.dashboard-3-2 {
  height: max-content;
}

.dashboard-wHead {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-variation-settings:
    'wdth' 75;
}


.dashboard-2-1-1>div:nth-of-type(1) {
  font-size: 16px;
  font-weight: 700;
}

.d-button {
  border: 1px solid rgba(43, 39, 39, 0.404);
  border-radius: 10px;
  transition: all 300ms;
}

.d-button:hover {
  background-color: rgba(43, 39, 39, 0.404);
}

.d-button>.icon {
  height: 20px;
  width: 20px;
  margin: 6px;

}
</style>