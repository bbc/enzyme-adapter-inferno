import { configure } from 'enzyme';
import './withDom';
import InfernoEnzymeAdapter from '../../src/InfernoEnzymeAdapter';

configure({ adapter: new InfernoEnzymeAdapter() });
