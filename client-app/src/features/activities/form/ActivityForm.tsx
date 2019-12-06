import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    selectedActivity: initialFormState,
    loadActivity,
    clearActivity
  } = activityStore;

  const [selectedActivity, setSelectedActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (match.params.id && selectedActivity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setSelectedActivity(initialFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    selectedActivity.id.length
  ]);

  const handleSubmit = () => {
    if (selectedActivity.id.length === 0) {
      let newActivity = {
        ...selectedActivity,
        id: uuid()
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(selectedActivity).then(() =>
        history.push(`/activities/${selectedActivity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setSelectedActivity({ ...selectedActivity, [name]: value });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              onChange={handleInputChange}
              name='title'
              placeholder='Title'
              value={selectedActivity.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name='description'
              rows={2}
              placeholder='Description'
              value={selectedActivity.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name='category'
              placeholder='Category'
              value={selectedActivity.category}
            />
            <Form.Input
              onChange={handleInputChange}
              name='date'
              type='datetime-local'
              placeholder='Date'
              value={selectedActivity.date}
            />
            <Form.Input
              onChange={handleInputChange}
              name='city'
              placeholder='City'
              value={selectedActivity.city}
            />
            <Form.Input
              onChange={handleInputChange}
              name='venue'
              placeholder='Venue'
              value={selectedActivity.venue}
            />
            <Button
              loading={submitting}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button
              onClick={() => history.push('/activities')}
              floated='right'
              type='button'
              content='Cancel'
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
