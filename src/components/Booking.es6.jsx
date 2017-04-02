import React from 'react';
import { connect } from 'react-redux'
import { Field, change } from 'redux-form'
import { Accordion, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { required } from './BookingValidations'
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
// import db from '../../db.json';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
};

let mapDispatchToProps = (dispatch) => {
  return {
   changeFieldValue: function(field, value) {
     dispatch(change('booking', field, value))
   }
  }
}

let mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        form: state.form.booking
    }
}

class Booking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      service: -1
    };
  }

  componentDidMount() {
    const self = this;
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    const url = isDevelopment
      ?  'http://localhost:3004/services'
      : 'http://localhost:8080/services';

    axios.get(url)
      .then(checkStatus)
      .then(function(response) {
        self.setState({ services: isDevelopment ? response.data : response.data.services })
      })
      .catch(function(error) {
      });

    document.getElementsByName('firstName')[0].focus();
  }

  selectService(e, id) {
      e.preventDefault();

      this.props.changeFieldValue('service', id);

      const service = this.state.services.find(item => {
          return item.id === id;
      });

      const endDate = new moment(this.props.form.initial.startDate);
      endDate.add(moment.duration(service.maximum, 'minutes'));
      this.props.changeFieldValue('endDate', endDate);
  }

  renderTime(service) {
      if (service.minimum === service.maximum) {
          return service.minimum + ' min(s)';
      }

      return service.minimum + ' - ' + service.maximum + ' min(s)';
  }

  renderPanel(category, services) {
    return (
      <Panel key={category} header={category + ' Services'} eventKey={category}>
        <ListGroup>
        {
          services.map((service) => {
            return <ListGroupItem key={service.id} id={service.id} onClick={(e) => this.selectService(e, service.id)}>
                <div>
                    {service.name} {this.renderTime(service)} {service.price + '£'}
                </div>
            </ListGroupItem>
          })
        }
        </ListGroup>
      </Panel>
    )
  }

  renderField(fields) {
    const { input, label, type, className, meta: { touched, error, warning } } = fields;
    return (
      <div className='form-group row'>
        <label className='col-sm-2 col-form-label'>{label}</label>
        <div className='col-sm-10'>
          <input {...input} placeholder={label} type={type} className={className} />
          {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
      </div>
    );
  }

  render() {
    const panels = _.chain(this.state.services)
      .groupBy('category')
      .toPairs()
      .map((values, key) => {
        return this.renderPanel(values[0], values[1])
      })
      .value();

    const styles = { padding: '10px 0px' }
    return (
      <div style={styles}>
        <Field name='firstName'
          className='form-control'
          component={this.renderField}
          type='text'
          label='First Name'
          validate={required} />

        <Field name='lastName'
            className='form-control'
            component={this.renderField}
            type='text'
            label='Last Name'
            validate={required} />

        <Field name='email'
            className='form-control'
            component={this.renderField}
            type='email'
            label='Email'
            validate={required} />

        <Field name='phone'
          className='form-control'
          component={this.renderField}
          type='text'
          label='Phone Number'
          validate={required} />

        <Field name='service'
          component={this.renderField}
          type='hidden' />

        <Accordion>
            {panels}
        </Accordion>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Booking)
