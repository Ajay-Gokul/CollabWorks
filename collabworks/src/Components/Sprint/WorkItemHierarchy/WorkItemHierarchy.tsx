import React, { useEffect, useState } from "react";
import { WorkItem } from "../../../Model/WorkItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./WorkItemHierarchy.css";
import { setHighlightedWorkItemUID } from "../../../State/ActionCreators";
import { StateModel } from "../../../State/StateModel";

interface WorkItemProps {
  workItemProps: WorkItem;
}

const WorkItemHierarchy = ({ workItemProps }: WorkItemProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [totalStoryPoints, setTotalStoryPoints] = useState<number>();
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [hoveredWorkItem, setHoveredWorkItem] = useState<string | null>(null);

  const handleClick = () => {
    setIsOpen((open) => !open);
  };

  const handleHighlightedWorkItem = (workItemPropUID: string) => {
    dispatch(setHighlightedWorkItemUID(workItemPropUID));
  };

  const stateDetails = useSelector(
    (state: StateModel) => state.highlightedWorkItemUID
  );

  const calculateTotalStoryPoints = (workItem: WorkItem): number => {
    if (!workItem.relatedWorkItems || workItem.relatedWorkItems.length === 0) {
      return workItem.storyPoint || 0;
    }

    return (
      workItem.storyPoint +
      workItem.relatedWorkItems.reduce(
        (total, item) => total + calculateTotalStoryPoints(item),
        0
      )
    );
  };

  useEffect(() => {
    if (workItemProps.workItemType === "Feature") {
      setWorkItems([workItemProps]);
    } else {
      setWorkItems([]);
    }
  }, [workItemProps]);

  useEffect(() => {
    setTotalStoryPoints(calculateTotalStoryPoints(workItemProps));
  }, [workItemProps]);

  return (
    <>
      <div className="workItemHierarchy">
        <div
          className={`workItemHierarchy ${
            stateDetails === workItemProps.uid ? "highlighted" : ""
          }`}
        >
          <div
            onMouseEnter={() => setHoveredWorkItem(workItemProps.uid)}
            onMouseLeave={() => setHoveredWorkItem(null)}
            className={`workItemHierarchy-details ${
              hoveredWorkItem !== null ? "hovered" : ""
            }`}
          >
            <div className="toggle-icon">
              {workItemProps.relatedWorkItems &&
                workItemProps.relatedWorkItems.length > 0 &&
                (isOpen ? (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    onClick={() => {
                      handleClick();
                    }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={() => {
                      handleHighlightedWorkItem(workItemProps.uid);
                      handleClick();
                    }}
                  />
                ))}
              <img
                style={{ marginLeft: "10px" }}
                src={require(`../Assets/${workItemProps.imagePath}`)}
                alt="workItem-Icon"
                className="workItem-icon"
              />
              <span
                onClick={() =>
                  navigate(`/workItemDetails/${workItemProps.uid}`)
                }
              >
                {workItemProps.name}
              </span>
            </div>
            <div>{workItemProps.assignedTo}</div>
            <div>{workItemProps.status}</div>
            <div>{workItemProps.workItemType}</div>
            <div>
              {workItemProps.workItemType === "Feature"
                ? totalStoryPoints
                : workItemProps.storyPoint}
            </div>
          </div>
        </div>
      </div>

      {isOpen &&
        (workItemProps.relatedWorkItems?.length ? (
          <div style={{ paddingLeft: "20px", marginTop:"-35px" }}>
            {workItemProps.relatedWorkItems.map((item: WorkItem, index) => (
              <WorkItemHierarchy key={index} workItemProps={item} />
            ))}
          </div>
        ) : null)}
    </>
  );
};

export default WorkItemHierarchy;
