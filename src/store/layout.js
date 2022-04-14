import { defineStore } from 'pinia';
import localForage from "localforage";
const storage = localForage.createInstance({
    storeName: "layout",
    description: "Layout data",
});


/**
 * Layout Store
 * Handles visibility of user interface components
 */
export const useLayoutStore = defineStore('layout',{
    state: () => {
        return {
            expandedColumn: 'left',         // left|right|none
            leftContent: 'instructions',    // instructions
            rightContent: 'essay'           // essay
        }
    },

    getters: {
        isLeftExpanded: (state) => state.expandedColumn == 'left',
        isRightExpanded: (state) => state.expandedColumn == 'right',

        isLeftVisible: (state) => state.expandedColumn != 'right',
        isRightVisible: (state) => state.expandedColumn != 'left',

        isInstructionsSelected: (state) => state.leftContent == 'instructions',
        isResourcesSelected: (state) => state.leftContent == 'resources',

        isInstructionsVisible: (state) => (state.expandedColumn != 'right' && state.leftContent == 'instructions'),
        isResourcesVisible: (state) => (state.expandedColumn != 'right' && state.leftContent == 'resources'),

        isEssayVisible: (state) => (state.expandedColumn != 'left' && state.rightContent == 'essay')
    },

    actions: {

        async loadFromStorage() {
            try {
                const data = await storage.getItem('layout');

                this.expandedColumn = data.expandedColumn;
                this.leftContent = data.leftContent;
                this.rightContent = data.rightContent;

            } catch (err) {
                console.log(err);
            }
        },

        async saveToStorage() {
            try {
                await storage.setItem('layout', {
                    expandedColumn: this.expandedColumn,
                    leftContent: this.leftContent,
                    rightContent: this.rightContent
                })
            } catch (err) {
                console.log(err);
            }
        },

        showInstructions() {
            this.setLeftVisible();
            this.leftContent = 'instructions';
            this.saveToStorage();
        },

        showResources() {
            this.setLeftVisible();
            this.leftContent = 'resources';
            this.saveToStorage();
        },

        showEssay() {
            this.setRightVisible();
            this.rightContent = 'essay';
            this.saveToStorage();
        },

        setLeftVisible() {
            if (!this.isLeftVisible) {
                this.expandedColumn = 'left';
                this.saveToStorage();
            }
        },

        setRightVisible() {
            if (!this.isRightVisible) {
                this.expandedColumn = 'right';
                this.saveToStorage();
            }
        },

        setLeftExpanded(expanded) {
            this.expandedColumn = expanded ? 'left' : 'none';
            this.saveToStorage();
        },

        setRightExpanded(expanded) {
            this.expandedColumn = expanded ? 'right' : 'none';
            this.saveToStorage();
        }
    }
});