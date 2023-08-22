<template>
    <ion-header mode="md">
        <ion-toolbar>
            <ion-title>Tracker.Task </ion-title>
            <ion-buttons slot="end">
                <slot />
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<script lang="ts" setup>
import {IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/vue'
</script>
