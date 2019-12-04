import { observable, action, computed } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable loading = false;
  @observable selectedActivity: IActivity | null = null;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.activities
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loading = true;
    try {
      const response = await agent.Activities.list();
      response.map(activity => {
        activity.date = activity.date.split('.')[0];
        return this.activities.push(activity);
      });
    } catch (error) {
      console.log(error);
    }
    this.loading = false;

    // agent.Activities.list()
    //   .then(response => {
    //     response.map(activity => {
    //       activity.date = activity.date.split('.')[0];
    //       return this.activities.push(activity);
    //     });
    //   })
    //   .catch(error => console.log(error))
    //   .finally(() => (this.loading = false));
  };

  @action loadActivity = async (id: string) => {
    let activity = (this.selectedActivity = this.activities.filter(
      a => a.id === id
    )[0]);
    if (activity) {
      this.selectedActivity = activity;
    } else {
      this.loading = true;
      try {
        activity = await agent.Activities.details(id);
        this.selectedActivity = activity;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      this.activities.push(activity);
    } catch (error) {
      console.log(error);
    }
    this.submitting = false;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      this.activities = [
        ...this.activities.filter(a => a.id !== activity.id),
        activity
      ];
      this.selectedActivity = activity;
    } catch (error) {
      console.log(error);
    }
    this.submitting = false;
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    try {
      this.target = id;
      await agent.Activities.delete(id);
      this.activities = [...this.activities.filter(a => a.id !== id)];
    } catch (error) {
      console.log(error);
    }
    this.submitting = false;
    this.target = '';
  };

  @action clearActivity = () => {
    this.selectedActivity = null;
  };
}

export default createContext(new ActivityStore());
