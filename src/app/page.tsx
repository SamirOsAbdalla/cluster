"use client"
import GroupTable from "@/components/GroupTable/GroupTable"
import Sidebar from "../components/Sidebar/Sidebar"
import TaskTable from "@/components/TaskTable/TaskTable"
import "./home.css"
import { useState } from "react"
import LoadingGroup from "@/components/LoadingGroup/LoadingGroup"

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)

  return (
    <div className="home__wrapper">
      {loading && <LoadingGroup />}
      <GroupTable setLoading={setLoading} loading={loading} />
      <TaskTable
        loading={loading}
        taskTableType="urgent"
      />
    </div>
  )
}
