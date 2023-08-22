<template>
    <ion-page>
        <header-component>
            <ion-button @click="refresh" color="primary">REFRESH</ion-button>
        </header-component>
        <ion-content>
            <div class="container">
                <ion-input placeholder="Input task title" v-model="value" />
                <ion-button
                    mode="md"
                    class="create-task-button"
                    @click="addTask">
                    Create task
                </ion-button>
            </div>
            <ion-list class="list">
                <ion-list-header mode="md">
                    <ion-title>Uncompleted</ion-title>
                </ion-list-header>
                <template v-if="isLoading">
                    <ion-item>
                        <ion-label>Loading...</ion-label>
                    </ion-item>
                </template>
                <template v-else>
                    <ion-item v-for="item in uncompletedTasks" :key="item.id">
                        <ion-label class="ion-text-wrap">{{
                            item.name
                        }}</ion-label>
                        <div class="complete" @click="toggleTask(item)"></div>
                        <div class="remove" @click="removeTask(item)"></div>
                    </ion-item>
                </template>
            </ion-list>

            <ion-list class="list">
                <ion-list-header mode="md">
                    <ion-title>Completed</ion-title>
                </ion-list-header>
                <template v-if="isLoading">
                    <ion-item>
                        <ion-label>Loading...</ion-label>
                    </ion-item>
                </template>
                <template v-else>
                    <ion-item
                        class="completed-list"
                        v-for="item in comletedTasks"
                        :key="item.id">
                        <ion-label class="ion-text-wrap">{{
                            item.name
                        }}</ion-label>
                        <div class="complete" @click="toggleTask(item)"></div>
                        <div class="remove" @click="removeTask(item)"></div>
                    </ion-item>
                </template>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { Header as HeaderComponent } from '@/widgets/Header'
import {
    IonContent,
    IonPage,
    IonTitle,
    IonListHeader,
    IonInput,
    IonButton,
    IonItem,
    IonList,
    IonLabel,
} from '@ionic/vue'
import { taskModel } from '@/features/task'

const {
    addTask,
    comletedTasks,
    uncompletedTasks,
    removeTask,
    toggleTask,
    isLoading,
    refresh,
} = taskModel.useTasks()
</script>

<style scoped>
.container {
    margin-top: var(--ion-safe-area-top);
    padding: 0 16px;
}

.create-task-button {
    width: auto;
    margin-top: 12px;
}

.list {
    margin-top: 12px;
}

.completed-list {
    text-decoration: line-through;
}

ion-icon {
    color: blue;
}

.remove {
    width: 24px;
    height: 24px;
    background-color: red;
    border-radius: 4px;
    margin-left: 6px;
}

.complete {
    width: 24px;
    height: 24px;
    background-color: green;
    border-radius: 4px;
}
</style>
