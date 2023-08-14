"use client"
import GroupTable from "@/components/GroupTable/GroupTable"
import Sidebar from "../components/Sidebar/Sidebar"
import TaskTable from "@/components/TaskTable/TaskTable"
import "./home.css"
import { useState } from "react"
import LoadingGroup from "@/components/LoadingGroup/LoadingGroup"
import { GroupInterface } from "@/lib/mongo/models/GroupModel"

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)
  const [taskGroups, setTaskGroups] = useState<GroupInterface[]>([])
  const [fetchGroup, setFetchGroup] = useState<boolean>(false)
  return (
    <div className="home__wrapper">
      {loading && <LoadingGroup type="groups" />}
      <GroupTable setLoading={setLoading} setFetchGroup={setFetchGroup} loading={loading} />
      {fetchGroup == true &&
        <TaskTable
          loading={loading}
          taskTableType="urgent"
        />}
    </div>
  )
}
