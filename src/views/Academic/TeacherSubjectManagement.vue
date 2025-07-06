<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      Gestion Professeurs & Matières
    </h1>

    <!-- Onglets -->
    <div class="mb-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'subjects'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'subjects' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            ]"
          >
            Matières
          </button>
          <button
            @click="activeTab = 'teachers'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'teachers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
            ]"
          >
            Professeurs
          </button>
        </nav>
      </div>
    </div>

    <!-- Onglet Matières -->
    <div v-if="activeTab === 'subjects'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Matières</h2>
        <button
          @click="showSubjectModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Nouvelle Matière
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="subject in subjects"
          :key="subject._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 class="text-lg font-semibold mb-2">{{ subject.name }}</h3>
          <p class="text-gray-600">{{ subject.code }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ subject.description }}</p>
        </div>
      </div>
    </div>

    <!-- Onglet Professeurs -->
    <div v-if="activeTab === 'teachers'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Professeurs</h2>
        <button
          @click="showTeacherModal = true"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Nouveau Professeur
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="teacher in teachers"
          :key="teacher._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 class="text-lg font-semibold mb-2">
            {{ teacher.firstName }} {{ teacher.lastName }}
          </h3>
          <p class="text-gray-600">{{ teacher.email }}</p>
          <p class="text-sm text-gray-500">ID: {{ teacher.employeeId }}</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddSubjectModal
      :is-open="showSubjectModal"
      @close="showSubjectModal = false"
      @submit="handleCreateSubject"
    />

    <AddTeacherModal
      :is-open="showTeacherModal"
      :subjects="subjects"
      @close="showTeacherModal = false"
      @submit="handleCreateTeacher"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Subject, Teacher, CreateSubjectDto, CreateTeacherDto } from '@/types/academic'
import { createSubject, getSubjects, createTeacher, getTeachers } from '@/services/academicService'
import AddSubjectModal from '@/components/academic/AddSubjectModal.vue'
import AddTeacherModal from '@/components/academic/AddTeacherModal.vue'

const activeTab = ref('subjects')
const showSubjectModal = ref(false)
const showTeacherModal = ref(false)
const subjects = ref<Subject[]>([])
const teachers = ref<Teacher[]>([])

const handleCreateSubject = async (subjectData: CreateSubjectDto) => {
  try {
    const tenantId = localStorage.getItem('currentTenantId') || ''
    const newSubject = await createSubject(subjectData, tenantId)
    subjects.value.push(newSubject)
    showSubjectModal.value = false
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const handleCreateTeacher = async (teacherData: CreateTeacherDto) => {
  try {
    const tenantId = localStorage.getItem('currentTenantId') || ''
    const newTeacher = await createTeacher(teacherData, tenantId)
    teachers.value.push(newTeacher)
    showTeacherModal.value = false
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const loadData = async () => {
  try {
    const tenantId = localStorage.getItem('currentTenantId') || ''
    const [subjectsData, teachersData] = await Promise.all([
      getSubjects(tenantId),
      getTeachers(tenantId)
    ])
    subjects.value = subjectsData
    teachers.value = teachersData
  } catch (error) {
    console.error('Erreur:', error)
  }
}

onMounted(() => {
  loadData()
})
</script> 