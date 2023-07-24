<template>
    <transition name="modal-animation">
        <div v-show="modalActive" class="modal" @click="close">
            <transition name="modal-animation-inner">
                <div v-show="modalActive" class="modal-inner" @click.stop>
                    <slot />
                    <div class="button-container">
                        <button class="button" @click="close" type="button">Cancel</button>
                        <button v-if="showConfirmButton" class="button button--valid" @click="confirm">Confirmer</button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script lang="ts">
export default {
    props: ['modalActive', 'showConfirmButton'],
    setup(props, {emit}) {

        const close = () => {
            emit('close');
        }

        const confirm = () => {
            emit('confirm');
        }

        return { close, confirm }
    }
}
</script>