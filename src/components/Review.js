import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Review = (props)  => {
  const [state, setState] = useState({ name: '', dob: '', address: ''});
  
  useEffect(() => {
    const { steps } = props;
    const { name, dob, address } = steps;
    setState({ name, dob, address });
  }, [props])

    const { name, dob, address } = state;
    return (
      <div style={{ width: '100%' }}>
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name.value}</td>
            </tr>
            <tr>
              <td>dob</td>
              <td>{dob.value}</td>
            </tr>
            <tr>
              <td>address</td>
              <td>{address.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

export default Review;