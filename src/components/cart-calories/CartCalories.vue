<script lang="ts" setup>
import { CalculatedFoodItem } from '../../helpers/indexDB/types'
import CaloriesIcon from '../icons/CaloriesIcon.vue'
import { ref } from 'vue'

export interface Props {
  items: CalculatedFoodItem[]
  sum: number,
  show: boolean,
}

const props = defineProps<Props>()
const isOpen = ref(false)
</script>
<template>
  <div v-show="props.show">
    <transition name="slide-to-side">
      <div v-show="isOpen" class="calories-cart">
        <div class="calories-cart-wrapper">
          <div class="NewCart_title">
            <h2 class="calories-cart-title">Калории</h2>
            <button
                @click.stop="isOpen = false"
                class="UiKitButton_root UiKitButton_size-xs UiKitButton_variant-simple UiKitButton_shape-default NewCart_clear"
            >
              <span class="">Закрыть</span>
            </button>
          </div>
          <div v-for="(item, idx) in props.items" :key="idx" class="cart-item">
            <div class="cart-info-wrapper">
              <div class="cart-info">
                {{ item.name }}
              </div>
            </div>
            <div v-if="item.fullCalories" class="cart-item-calories">
              <div class="cart-calories-info">
                {{ item.fullCalories?.toFixed(0) }}
              </div>
              <div class="cart-calories-name">ккал</div>
            </div>
          </div>
        </div>
        <div v-show="props.items.length" class="cart-summary">
          <div>{{ props.sum.toFixed(0) }}</div>
          <div class="cart-summary-name">ккал</div>
        </div>
      </div>
    </transition>
    <div class="calories-button" @click.stop="isOpen = !isOpen">
      <calories-icon />
    </div>
  </div>
</template>

<style scoped>
.calories-cart {
  position: fixed;
  width: 320px;
  height: calc(100vh - 110px);
  border-radius: 24px 0 0 0;
  top: 110px;
  right: 0;
  background-color: #ffffff;
  z-index: 110;
  box-shadow: rgba(0, 0, 0, 0.12) -8px -8px 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-size: 13px;
  font-family: YSText, sans-serif;
  line-height: 15px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;

  .calories-cart-wrapper {
    position: relative;
    overflow-y: auto;
    scrollbar-width: thin;
    height: 96%;

    .back-button {
      position: absolute;
      left: -20px;
      top: 0;
    }
  }

  .cart-summary {
    width: 100%;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    height: 6%;
    color: #fa6a3c;
    font-weight: 700;
    font-size: 24px;
  }

  .calories-cart-title {
    margin-top: 4px;
    color: #21201f;
    font-weight: 700;
    font-size: 24px;
  }

  .cart-summary-name {
    color: #9e9b98;
    font-weight: 400;
    font-size: 16px;
  }

  .cart-item:not(:first-child):not(:nth-child(2))::before {
    top: 0;
    left: 93px;
    right: 0;
    height: 0.5px;
    content: '';
    position: absolute;
    background: rgba(138, 135, 132, 0.4);
  }

  .cart-item {
    color: inherit;
    width: 100%;
    min-height: 56px;
    border: none;
    display: flex;
    padding: 8px 16px;
    text-align: left;
    align-items: center;
    border-radius: 10px;
    justify-content: space-between;
    position: relative;
    background-color: #ffffff;

    .cart-info-wrapper {
      flex-grow: 1;
      min-width: 0;
    }

    .cart-info {
      width: 249px;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #21201f;
      margin: 6px 0 8px;
    }

    .cart-weight {
      color: #9e9b98;
    }

    .cart-item-calories {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 40px;
      margin-left: 8px;
      .cart-calories-info {
        font-size: 16px;
        line-height: 21px;
        margin-bottom: 1px;
        color: #21201f;
      }

      .cart-calories-name {
        font-size: 14px;
        line-height: 18px;
        color: #9e9b98;
      }
    }
  }
}

.calories-button {
  left: 20px;
  width: 60px;
  border: none;
  bottom: 100px;
  cursor: pointer;
  height: 60px;
  display: flex;
  z-index: 110;
  position: fixed;
  background: #fce000;
  box-shadow:
    0 10px 20px 0 rgba(252, 224, 0, 0.43),
    0 5px 10px 0 rgba(252, 224, 0, 0.28);
  align-items: center;
  border-radius: 50%;
  justify-content: center;
}

.slide-to-side-enter-active,
.slide-to-side-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-to-side-enter-from {
  transform: translateX(320px);
}
.slide-to-side-enter-to {
  transform: translateX(0);
}

.slide-to-side-leave-from {
  transform: translateX(0);
}
.slide-to-side-leave-to {
  transform: translateX(320px);
}
</style>
