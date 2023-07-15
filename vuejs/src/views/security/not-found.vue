<template>
    <section class="access-denied">
        <Header />
        <div class="container">
            <h5>404</h5>
            <h4>Page Not Found</h4>
            <p>We're sorry, the page you requested could not be found.</p>
            <p>Please go back to the <strong>profile page</strong></p>
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