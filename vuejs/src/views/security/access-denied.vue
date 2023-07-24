<template>
    <section class="access-denied">
        <Header />
        <div class="container">
            <h5>403</h5>
            <h4>Access Denied</h4>
            <p>Sorry, but you don't have permission to access this page.</p>
            <p>You can go back to your <strong>profile page</strong></p>
        </div>
    </section>
</template>

<script>
import Header from '../../components/Header.vue';

export default {
    components: {
        Header,
    },
}
</script>