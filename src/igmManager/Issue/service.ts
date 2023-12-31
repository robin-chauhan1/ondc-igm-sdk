import { IGM_ROUTES, EvaluateRoute, IssuesParamaters, ERROR_CODES } from '../igm.types';
import igmController from '../igm.controller';

class Issues {
  config: IssuesParamaters | undefined;

  init(params: IssuesParamaters) {
    if (!this.config) this.config = { ...params };
    else throw new Error('Issues class has already been initialised');
  }

  evaluateRoute({ req, res, route }: EvaluateRoute) {
    try {
      switch (route) {
        case IGM_ROUTES.ISSUE:
          // TO-DO: split validation logic in different function
          if (!this.config?.npType.includes('SELLER'))
            throw new Error('issue endpoint cannot be hosted if NP is not seller');
          igmController.issue(req, res);

          // TO-DO: split post-callback action in different function
          if (this.config.onSuccess?.[IGM_ROUTES.ISSUE]) {
            this.config.onSuccess?.[IGM_ROUTES.ISSUE]('');
          }
          break;
        case IGM_ROUTES.ON_ISSUE:
          // TO-DO: split validation logic in different function
          if (!this.config?.npType.includes('BUYER'))
            throw new Error('on_issue endpoint cannot be hosted if NP is not buyer');
          igmController.on_issue(req, res);
          // TO-DO: split post-callback action in different function
          if (this.config.onSuccess?.[IGM_ROUTES.ON_ISSUE]) {
            this.config.onSuccess?.[IGM_ROUTES.ON_ISSUE]('');
          }
          break;
        case IGM_ROUTES.ISSUE_STATUS:
          // TO-DO: split validation logic in different function
          if (!this.config?.npType.includes('SELLER'))
            throw new Error('issue_status endpoint cannot be hosted if NP is not seller');
          igmController.issue_status(req, res);
          // TO-DO: split post-callback action in different function
          if (this.config.onSuccess?.[IGM_ROUTES.ISSUE_STATUS]) {
            this.config.onSuccess?.[IGM_ROUTES.ISSUE_STATUS]('');
          }
          break;
        case IGM_ROUTES.ON_ISSUE_STATUS:
          // TO-DO: split validation logic in different function
          if (!this.config?.npType.includes('BUYER'))
            throw new Error('on_issue_status endpoint cannot be hosted if NP is not buyer');
          igmController.on_issue_status(req, res);
          // TO-DO: split post-callback action in different function
          if (this.config.onSuccess?.[IGM_ROUTES.ON_ISSUE_STATUS]) {
            this.config.onSuccess?.[IGM_ROUTES.ON_ISSUE_STATUS]('');
          }
          break;
        default:
          throw new Error('Unknown route');
      }
    } catch (err: any) {
      const errPayload = { message: err?.message, code: ERROR_CODES.ROUTE_NOT_VALID };
      console.log('here', this.config?.onError);
      if (this.config?.onError) this.config?.onError(errPayload);
      return { ...errPayload, error: true };
    }
  }
}

export default Issues;
