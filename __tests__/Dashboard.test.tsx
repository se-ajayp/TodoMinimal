import 'react-native';
import React from 'react';
import Dashboard from '../src/screens/Dashboard';
import renderer from 'react-test-renderer';

test('Dashboard snapShot', () => {
    const snap = renderer.create(
        <Dashboard />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});